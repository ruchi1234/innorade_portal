import { Meteor } from 'meteor/meteor';
import Boards from '/imports/modules/boards/collection';
import { check } from 'meteor/check';
import { Kadira } from 'meteor/meteorhacks:kadira';
import Can from '/imports/modules/can/can';

import inviteMethodHOF from '/imports/modules/invitations/methodHOF';
import Invitations from '/imports/modules/invitations/collection';
import { FlowRouter } from 'meteor/kadira:flow-router';

Meteor.methods({
  'board.update' (_id, fields) {
    check(_id, String);
    check(fields, Object);
    if(!Can.update.board(this.userId, _id)) {
      throw new Meteor.Error('Access denied.  Cannot update board');
    }
    Boards.update({ _id }, { $set: fields });
  },

  'board.insert' (fields) {
    check(fields, Object);
    if(!Can.insert.board(this.userId, fields)) {
      throw new Meteor.Error('Access denied.  Cannot insert board');
    }
    return Boards.insert(fields);
  },

  'board.remove' (_id) {
    check(_id, String);
    if(!Can.update.board(this.userId, _id)) {
      throw new Meteor.Error('Access denied.  Cannot remove board');
    }
    try {
      Boards.softRemove({ _id });
    } catch(err) {
      const type = 'board.remove';
      const message = err.message;
      Kadira.trackError(type, message);
      console.log('\n\n', message, '\n\n');
    }
  },

  /**
   * Insert board from wizard process.
   * @param {object} args
   * @returns {Object} board (unique)
   */
  boardInsertWiz(args) {
    console.log('boardInsertWiz');
    check(args, Object);
    if(!Can.insert.board(this.userId, args)) {
      throw new Meteor.Error('Access denied.  Cannot insert board');
    }

    const cusr = Meteor.user();

    // console.log("caption: " + args.caption);
    // console.log('caption: ', _caption);
    // console.log('args.wizAnswers', args.wizAnswers);

    const board = {
      answers: args.wizAnswers,
      caption: args.caption,
      categoryId: args.wizCategory,
      images: [],
      title: args.wizTitle,
      status: args.status,
      type: args.wizType,
      userId: cusr._id,
    };

    try {
      board._id = Boards.insert(board);
    } catch(err) {
      const type = 'boardInsertWiz';
      const message = err.message;
      Kadira.trackError(type, message);
      console.log('\n\n', message, '\n\n');
    }
    return board;
  },

});

if (Meteor.isServer) {
  SSR.compileTemplate('inviteNotificationEmailHTML', Assets.getText('emails/invite.html'));

  Meteor.methods({
    'boards.invite': inviteMethodHOF({
      renderEmail({ email, _id, notes, fromUser }) {
        const fromUserFirstName = fromUser.informalName();

        const board = Boards.findOne(_id);
        const creator = board.getCreator();
        const avatar = creator.getImage();
        const userName = creator.username;
        const {
          caption,
          title,
          boardProductImages,
          images,
          products,
        } = board;
        let boardUrl;
        // is private
        if (board.type) {
          boardUrl = Invitations.createLink(
            _.extend({
              invitingUserId: fromUser._id,
            }, {
              email,
              relatedId: _id,
              relatedType: 'board',
            })
          );
        } else {
          if (!Can.invite.board(this.userId, _id)) {
            throw new Error(`Access denied: Trying to share board ${_id} as user ${this.userId}`);
          }
          boardUrl = `${Meteor.absoluteUrl()}board/${_id}`;
        }

        const trackedBoardUrl = `${Meteor.absoluteUrl()}email-track?url=${encodeURIComponent(boardUrl)}&boardId=${_id}`;
        console.log('trackedBoardUrl: ', trackedBoardUrl);

        let bp0 = '';
        let bp1 = '';
        let bp2 = '';
        let bp3 = '';
        let bp4 = '';

        if (_.get(images, '0.href') !== undefined) {
          bp0 = _.get(images, '0.href');

          bp1 = _.get(boardProductImages, '0.href') ||
            `${Meteor.absoluteUrl()}img/emails/blank-image.png`;

          bp2 = _.get(boardProductImages, '1.href') ||
            `${Meteor.absoluteUrl()}img/emails/blank-image.png`;

          bp3 = _.get(boardProductImages, '2.href') ||
            `${Meteor.absoluteUrl()}img/emails/blank-image.png`;

          bp4 = _.get(boardProductImages, '3.href') ||
            `${Meteor.absoluteUrl()}img/emails/blank-image.png`;
        } else {
          bp0 = _.get(boardProductImages, '0.href') ||
            `${Meteor.absoluteUrl()}img/emails/blank-image.png`;

          bp1 = _.get(boardProductImages, '1.href') ||
            `${Meteor.absoluteUrl()}img/emails/blank-image.png`;

          bp2 = _.get(boardProductImages, '2.href') ||
            `${Meteor.absoluteUrl()}img/emails/blank-image.png`;

          bp3 = _.get(boardProductImages, '3.href') ||
            `${Meteor.absoluteUrl()}img/emails/blank-image.png`;

          bp4 = _.get(boardProductImages, '4.href') ||
            `${Meteor.absoluteUrl()}img/emails/blank-image.png`;
        }
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
        const emailData = {
          inviteUrl: trackedBoardUrl,
          userFirstName: fromUserFirstName,
          caption: triCap(),
          bp0,
          bp1,
          bp2,
          bp3,
          bp4,
          boardUrl: trackedBoardUrl,
          products,
          productName: title,
          referralComments: notes,
          username: userName,
          avatar,
          ROOT_URL: Meteor.absoluteUrl(),
        };
        // console.log(emailData);
        return {
          from: `${fromUser.fullName()} at Maven <friend@mavenxinc.com>`,
          userID: fromUser._id,
          to: email,
          subject: 'Check out this board at Maven!',
          created: new Date(),
          html: SSR.render('inviteBoard', emailData),
        };
      },
      findDoc: (relatedId) => Boards.findOne(relatedId),
      inviteToDoc: (relatedId, invitedIds) =>
        Boards.update({ relatedId }, { $addToSet: { invitedIds: { $each: invitedIds } } }),
    }),
  });
}
