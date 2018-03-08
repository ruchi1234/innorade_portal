import { Meteor } from 'meteor/meteor';
import Retailers from '/imports/modules/retailers/collection';
import _ from 'lodash';
import { check } from 'meteor/check';

Meteor.methods({

/**
 * Insert retailer.
 * @param {object} retailer
 * @returns {object} retailer
 */
  // retailerInsert(retailer) {
  //   check(Meteor.userId(), String);
  //   check(retailer, {
  //     domain: Match.Optional(String),
  //     logo: Match.Optional(String),
  //     network: Match.Optional(String),
  //     networkId: Match.Optional(String),
  //     // notes: Match.Optional([Object]),
  //     // notes are just a simple string for now - as written up in schema
  //     notes: Match.Optional(String),
  //     retailer: Match.Optional(String),
  //     retailer411: Match.Optional(String),
  //     returnpol: Match.Optional(String),
  //     shippingpol: Match.Optional(String),
  //     status: Match.Optional(Number),
  //   });
  //
  //   const defaultProperties = {
  //     userId: Meteor.userId(),
  //   };
  //   const _retailer = _.extend(defaultProperties, retailer);
  //   // retailer = _.extend(defaultProperties, retailer);
  //   _retailer._id = Retailers.insert(_retailer);
  //   console.log('post retailer insert', _retailer);
  //   return _retailer;
  // },

  /**
   * retailerUpsert.
   * @param {object} retailerAttrib
   * @returns {void}
   */
  retailerUpsert(retailerAttrib) {
    check(retailerAttrib, Object);

    const defaultProperties = {
      userId: Meteor.userId(),
    };
    const retailer = _.extend(defaultProperties, retailerAttrib);

    if (Retailers.findOne({ domain: retailer.domain }) != null) {
      Retailers.update({ _id: retailer._id },
        { $set: {
          indix_storeId: retailer.indix_storeId,
        } });
      return retailer._id;
    } else {
      return Retailers.insert(retailer);
    }
  },

  /**
   * retailerUpdate.
   * @param {object} retailer
   * @returns {void}
   */
  // retailerUpdate(rid, retailer) {
  //   console.log('retailer update');
  //
  //   check(rid, String);
  //   check(retailer, Retailers.Schema);
  //   check(Meteor.userId(), String);
  //
  //   console.log('domain: ', retailer.domain);
  //   console.log(retailer);
  //   console.log('update');
  //
  //   Retailers.update({ _id: rid }, { $set: retailer });
  // },

});
