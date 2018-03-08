import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';
import { Kadira } from 'meteor/meteorhacks:kadira';
import Products from '/imports/modules/products/collection';
import Boards from '/imports/modules/boards/collection';
import BoardProducts from '/imports/modules/clips/collection';
import Can from '/imports/modules/can/can';
import inviteMethodHOF from '/imports/modules/invitations/methodHOF';
import Invitations from '/imports/modules/invitations/collection';
import { FlowRouter } from 'meteor/kadira:flow-router';

Meteor.methods({
  'boardProducts.move'(id, oldIndex, newIndex) {
    check(id, String);
    check(oldIndex, Number);
    check(newIndex, Number);
    if (!Can.update.clip(this.userId, id)) {
      throw new Meteor.Error('Access denied.  Cannot update clip');
    }
    const bp = BoardProducts.findOne(id);
    if (!bp) {
      console.error('Board product to move not found', id);
    }
    const filter = {
      _id: {
        $ne: id,
      },
      boardId: bp.boardId,
      sort: {},
    };
    let modifier = {};
    if (newIndex > oldIndex) {
      filter.sort.$lte = newIndex;
      filter.sort.$gt = oldIndex;
      modifier = {
        $inc: {
          sort: -1,
        },
      };
    } else {
      filter.sort.$lt = oldIndex;
      filter.sort.$gte = newIndex;
      modifier = {
        $inc: {
          sort: 1,
        },
      };
    }
    BoardProducts.update({
      _id: id,
    }, {
      $set: {
        sort: newIndex,
      },
    });
    BoardProducts.update(filter, modifier, {
      multi: true,
    });
  },
  'boardProducts.remove'(_id) {
    check(_id, String);
    if (!Can.remove.clip(this.userId, _id)) {
      throw new Meteor.Error('Access denied.  Cannot update clip');
    }
    if (Meteor.isServer) {
      const bp = BoardProducts.findOne(_id);
      bp.move(Number.MAX_SAFE_INTEGER, () => {
        BoardProducts.softRemove(_id);
      });
    } else {
      BoardProducts.softRemove(_id);
    }
  },
  'boardProducts.update'(_id, fields) {
    check(_id, String);
    check(fields, Object);
    if (!Can.update.clip(this.userId, _id)) {
      throw new Meteor.Error('Access denied.  Cannot update clip');
    }
    BoardProducts.update({
      _id,
    }, {
      $set: fields,
    });
  },
  'clips.getCreator'(_id) {
    check(_id, String);
    const clip = BoardProducts.findOne({
      _id,
    });
    // return clip && clip.creator || undefined;
    return clip || undefined;
  },
});
Meteor.methods({
  addProdToBoard(bid, pid, prod) {
    check(bid, String);
    check(pid, String);
    check(prod, Object);
    if (!Can.insert.clip(this.userId, { boardId: bid })) {
      throw new Meteor.Error('Access denied.  Cannot insert clip');
    }
    try {
      const b = Boards.findOne({
        _id: bid,
      });

      // Let's not trigger updates for the board product move
      // And instead trigger it after all have updated
      BoardProducts.insert({
        // NOTE: can't create aurl until have a bpid -> hook
        boardId: bid,
        boardTitle: b && b.title || '',
        boardCreatorId: b && b.creatorId || '',
        caption: prod.caption,
        category: prod.category,
        description: prod.description,
        domain: prod.domain,
        images: prod.images,
        network: prod.network,
        price: prod.price,
        productId: pid,
        retailer: prod.retailer,
        title: prod.title,
        url: prod.url,
        surl: prod.surl,
        aurlType: prod.aurlType,
        sort: -1,
      });

      // Update board images
      if (Meteor.isServer) {
        Boards.resetImages(bid);
      }

      Products.update({
        _id: pid,
      }, {
        $push: {
          boards: bid,
        },
      });
      Boards.update({
        _id: bid,
      }, {
        $push: {
          products: pid,
        },
      });

      BoardProducts.direct.update({ boardId: bid }, { $inc: { sort: 1 } }, { multi: true });
    } catch (err) {
      const type = 'addProdToBoard';
      const message = err.message;
      Kadira.trackError(type, message);
      console.log('\n\n', message, '\n\n');
    }
  },
});

if (Meteor.isServer) {
  SSR.compileTemplate('inviteNotificationEmailHTML', Assets.getText('emails/invite.html'));

  Meteor.methods({
    'boardProducts.invite': inviteMethodHOF({
      renderEmail({
        email,
        _id,
        notes,
        fromUser,
      }) {
        const fromUserFirstName = fromUser.informalName();

        const bprod = BoardProducts.findOne(_id);
        const creator = bprod.getCreator();
        const avatar = creator.getImage();
        const userName = creator.username;
        const {
          images,
          caption,
          price,
          title,
          productId,
        } = bprod;
        const length = 250;
        const triCap = () => {
          let response = '';
          if (caption) {
            response = caption.length > length ? `${caption.substring(0, length - 3)}...` : caption;
          } else {
            response = '';
          }
          return response;
        };

        let clipUrl; // is private
        if (bprod.type) {
          clipUrl = Invitations.createLink(_.extend({
            invitingUserId: fromUser._id,
          }, {
            email,
            relatedId: _id,
            relatedType: 'product',
          }));
        } else {
          if (!Can.invite.clip(this.userId, _id)) {
            throw new Error(`Access denied: Trying to share clip ${_id} as user ${this.userId}`);
          }
          clipUrl = `${Meteor.absoluteUrl()}product/${_id}`;
        }

        const trackedClipUrl = `${Meteor.absoluteUrl()}email-track?url=${encodeURIComponent(clipUrl)}&clipId=${_id}`;
        console.log('trackedClipUrl: ', trackedClipUrl);

        let bp0 = '';
        bp0 = _.get(images, '0.href');
        const emailData = {
          inviteUrl: trackedClipUrl,
          userFirstName: fromUserFirstName,
          caption: triCap(),
          bp0,
          boardUrl: trackedClipUrl,
          retailerName: bprod.retailer || '',
          retailerUrl: bprod.aurl || '',
          productName: title,
          referralComments: notes,
          username: userName,
          avatar,
          price,
          ROOT_URL: Meteor.absoluteUrl(),
        };
        return {
          from: `${fromUser.fullName()} at Maven <friend@mavenxinc.com>`,
          userID: fromUser._id,
          to: email,
          subject: 'Check out this product at Maven!',
          created: new Date(),
          html: SSR.render('inviteProduct', emailData),
        };
      },
      // I think ideally, we'll want these removed from inviteMethodHOF
      findDoc: (relatedId) => BoardProducts.findOne(relatedId),
      inviteToDoc: (relatedId, invitedIds) => BoardProducts.update({
        relatedId,
      }, {
        $addToSet: {
          invitedIds: {
            $each: invitedIds,
          },
        },
      }),
    }),
  });
}
