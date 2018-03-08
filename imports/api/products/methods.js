import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';
import { Kadira } from 'meteor/meteorhacks:kadira';
import Can from '/imports/modules/can/can';

import '/imports/startup/mongo_collection_extensions';
import Products from '/imports/modules/products/collection';
import BoardProducts from '/imports/modules/clips/collection';

import inviteMethodHOF from '/imports/modules/invitations/methodHOF';
import Invitations from '/imports/modules/invitations/collection';
import { FlowRouter } from 'meteor/kadira:flow-router';

Meteor.methods({
  'product.update'(_id, fields) {
    check(_id, String);
    check(fields, Object);
    if (!Can.update.product(this.userId, _id)) {
      throw new Meteor.Error('Access denied.  Cannot update product');
    }
    Products.update({ _id }, { $set: fields });
  },

  'product.insert'(fields) {
    check(fields, Object);
    if (!Can.insert.product(this.userId, fields)) {
      throw new Meteor.Error('Access denied.  Cannot update product');
    }
    Products.insert(fields);
  },

  /**
   * Update product.
   * @param {string} pid
   * @param {Object} product
   * @returns {string} pid
   */

  productUpsert(pid, product) {
    check(pid, String);
    check(product, Object);

    try {
      const prod = Products.findOne({ url: product.url });
      if (prod) {
        if (!Can.update.product(this.userId, prod._id, product)) {
          throw new Meteor.Error('Access denied.  Cannot update product');
        }
        Products.update({ url: product.url },
          { $set: {
            // indix_categoryName: product.indix_categoryName || '',
            // indix_brandName: product.indix_brandName || '',
            // indix_minSalePrice: product.indix_minSalePrice || 0,
            // indix_maxSalePrice: product.indix_maxSalePrice || 0,
            // indix_retailer: product.indix_retailer || '',
            // indix_salePrice: product.indix_salePrice || 0,
            // indix_storeId: product.indix_storeId || '',
            // indix_upcs: product.indix_upcs || [],
            price: product.price || 0,
          },
        });
        return prod._id;
      } else {
        if (!Can.insert.product(this.userId, product)) {
          throw new Meteor.Error('Access denied.  Cannot insert product');
        }
        const res = Products.insert({
          domain: product.domain,
          // indix_mpid: product.indix_mpid || '',
          // indix_categoryName: product.indix_categoryName || '',
          // indix_brandName: product.indix_brandName || '',
          // indix_minSalePrice: product.indix_minSalePrice || 0,
          // indix_maxSalePrice: product.indix_maxSalePrice || 0,
          // indix_retailer: product.indix_retailer || '',
          // indix_salePrice: product.indix_salePrice || 0,
          // indix_storeId: product.indix_storeId || '',
          // indix_upcs: product.indix_upcs || [],
          network: product.network,
          price: product.price,
          retailer: product.retailer,
          url: product.url,
        });
        return res;
      }
    } catch (err) {
      const type = 'productUpsert';
      const message = err.message;
      Kadira.trackError(type, message);
      console.error('\n\n', message, '\n\n');
    }
  },
  'product.invite': inviteMethodHOF(
    {
      renderEmail({ email, _id, notes, fromUser }) {
        const userName = _.get(fromUser, 'username');
        const userFirstName = _.get(fromUser, 'profile.firstName');
        const avatar = _.get(fromUser, 'profile.image_url') || `${Meteor.absoluteUrl()}img/login/gavatar.jpg}`;
        const {
          caption,
          title,
          creator,
          creatorId,
          boardProductCount,
          boardProductImages,
          products,
        } = Boards.findOne(_id);
        const url = (Boards.findOne(_id) && Boards.findOne(_id).isPublic()) ?
        FlowRouter.url('board', { _id }) :
        Invitations.createLink(
          _.extend({
            invitingUserId: fromUser._id,
          }, {
            email,
            relatedId: _id,
            relatedType: 'board',
          })
        );
        const emailData = {
          inviteUrl: url,
          userFirstName,
          caption,
          boardProductImages,
          products,
          avatar
        };
        return {
          from: Meteor.settings.emails.inviteBoard,
          userID: fromUser._id,
          to: email,
          subject: `${fromUser.fullName()} has invited you to a Board - ${title}`,
          created: new Date(),
          html: SSR.render('inviteNotificationEmailHTML', emailData),
        };
      },
      findDoc: (relatedId) => Boards.findOne(relatedId),
      inviteToDoc: (relatedId, invitedIds) =>
        Boards.update({ relatedId }, { $addToSet: { invitedIds: { $each: invitedIds } } }),
    }),
});
