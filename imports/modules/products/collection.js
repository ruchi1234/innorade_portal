import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import { DEFAULT_LIMIT } from '/imports/startup/vars';

import moment from 'moment';
import { check } from 'meteor/check';
import '/imports/startup/mongo_collection_extensions';
import BoardProducts from '/imports/modules/clips/collection';
import attachCreatorBehavior from '/imports/modules/collection_behaviors/creator';
import attachFavoritableBehavior from '/imports/modules/collection_behaviors/favoritable';
import attachContributableBehavior from '/imports/modules/collection_behaviors/contributable';
import attachImagesBehavior from '/imports/modules/collection_behaviors/images';

const Products = new Mongo.Collection('products');

attachCreatorBehavior(Products);
attachContributableBehavior(Products);
attachFavoritableBehavior(Products);
attachImagesBehavior(Products);

// Product collection is entirely about data aggregation and reporting really.
// roll up data in new and interesting ways.

const Schema = new SimpleSchema({
  boards: {
    type: [String],
    optional: true,
  },
  boardProductCount: {
    type: Number,
    optional: true,
  },
  category: {
    type: String,
    optional: true,
  },
  domain: {
    type: String,
    optional: true,
  },
  indix_mpid: {
    type: String,
    optional: true,
  },
  indix_categoryName: {
    type: String,
    optional: true,
  },
  indix_upcs: {
    type: [String],
    optional: true,
  },
  indix_brandName: {
    type: String,
    optional: true,
  },
  indix_minSalePrice: {
    type: Number,
    decimal: true,
    optional: true,
  },
  indix_maxSalePrice: {
    type: Number,
    decimal: true,
    optional: true,
  },
  indix_salePrice: {
    type: Number,
    decimal: true,
    optional: true,
  },
  indix_retailer: {
    type: String,
    optional: true,
  },
  indix_storeId: {
    type: String,
    optional: true,
  },
  // network: clearing house who are submitting link via
  network: {
    type: String,
    optional: true,
  },
  // price can be set @ product scraper, product manual, or collection edit
  // modal - that's it.  Everything else is rendering.
  price: {  // retaining this as well, essentially last curated good price
    type: Number,
    decimal: true,
    optional: true,
  },
  retailer: {
    type: String,
    optional: true,
  },
  // status: 0 for open, 1 closed / private, 3 logical delete, 4 orphaned
  status: {
    type: Number,
    // allowedValues: [0, 1, 2, 3, 4],
    optional: true,
  },
  title: {
    type: String,
    optional: true,
  },
  // url: deep link to product on retailer site
  url: {
    type: String,
    optional: false,
    regEx: Mavenx.schemas.RegEx.Url,
  },
});

Products.attachSchema(Schema);
Products.attachBehaviour('softRemovable');
Products.attachBehaviour('timestampable', {
  createdAt: 'createdAt',
  createdBy: false,
  updatedAt: 'updatedAt',
  updated: 'updatedBy',
  systemId: '0',
});

Products.helpers({
  getCollection() {
    return Products;
  },

  isPublic() {
    return this.type === 0;
  },

  isPrivate() {
    return this.type === 1;
  },
});

if (Meteor.isServer) {
  Products.resetAllBoardProductCounts = (productId) => {
    Products.find().forEach((p) => {
      const count = BoardProducts.find({ productId: p._id }).count();
      Products.update({ _id: p._id }, { $set: { boardProductCount: count } });
    });
  };
}

/*
 * Find helpers
 *
 * Check parameters just to help with dev debugging
 */
Products.queryHelpers = {
  byId(options) {
    const { _id } = options;
    check(_id, String);
    return [{ _id }, {}, {}];
  },
  byKeyword(options) {
    const { keyword } = options;
    if (!keyword) { return [{}, {}, {}]; }

    const re = { $regex: new RegExp(keyword, 'i'), $options: 'i' };
    return [{ $or: [
      { caption: re },
      { 'creator.username': re },
      { title: re },
      { retailer: re },
    ] }, {}, {}];
  },
  sorted(options) {
    if (options && options.productId) {
      return [{}, { sort: { sort: 1, createdAt: -1 } }, {}];
    } else {
      return [{}, { sort: { createdAt: -1 } }, {}];
    }
  },
  my(options) {
    const { userId } = options;
    return [{
      contributedByIds: { $in: [userId] },
    }, {}, {}];
  },
  public() {
    const query = {
      type: 0,
    };

    return [query, {}, {}];
  },
  new() {
    const query = this.sorted();
    query[0].created = { $gt: moment().add(-3, 'days').toDate() };
    return query;
  },

  /**
   * Non-find helpers
   * Should probably moved somewhere more common
   */
  limit() {
    return [{}, { limit: DEFAULT_LIMIT }, {}];
  },
  paged(options) {
    const { page } = options;
    check(page, Number);
    return [{}, { skip: (DEFAULT_LIMIT * page) }, {}];
  },
  nonReactive() {
    return [{}, {}, { reactive: false }];
  },
};

export default Products;
export { Schema };
