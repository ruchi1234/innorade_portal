import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import { check } from 'meteor/check';
import moment from 'moment';

import { DEFAULT_LIMIT } from '/imports/startup/vars';
import '/imports/startup/mongo_collection_extensions';
import Boards from '/imports/modules/boards/collection';
import { Schema as ProductSchema } from '/imports/modules/products/collection';
import attachCreatorBehavior from '/imports/modules/collection_behaviors/creator';
// import attachContributableBehavior from '/imports/modules/collection_behaviors/contributable';
import attachFavoritableBehavior from '/imports/modules/collection_behaviors/favoritable';
import attachImagesBehavior from '/imports/modules/collection_behaviors/images';

const BoardProducts = new Mongo.Collection('boardProducts');
BoardProducts.alias = 'clips';

attachCreatorBehavior(BoardProducts);
// attachContributableBehavior(BoardProducts);
attachFavoritableBehavior(BoardProducts);
attachImagesBehavior(BoardProducts);

const Schema = new SimpleSchema({
  aurl: {
    type: String,
    optional: true,
    //regEx: SimpleSchema.RegEx.Url
  },
  aurlType: {
    type: Number,
    optional: true,
  },
  boardId: {
    type: String,
    optional: false,
    regEx: SimpleSchema.RegEx.Id,
  },
  boardContributorIds: {
    type: [SimpleSchema.RegEx.Id],
    defaultValue: [],
  },
  boardCreatorId: {
    type: SimpleSchema.RegEx.Id,
  },
  boardTitle: {
    type: String,
    optional: true,
  },
  caption: {
    type: String,
    optional: true,
  },
  category: {
    type: String,
    optional: true,
  },
  description: {
    type: String,
    optional: true,
  },
  invitedIds: {
    type: [SimpleSchema.RegEx.Id],
    defaultValue: [],
  },
  productId: {
    type: String,
    optional: false,
    regEx: SimpleSchema.RegEx.Id,
  },
  sort: {
    type: Number,
    autoValue() {
      /*
       * Default it to one above the highest other value.
       * Should this find the actual max value, rather than count?
       * May be more robust, but should only happen if something goes
       * wrong elsewhere
       */
      if (this.isInsert && !this.isSet) {
        const boardId = this.field('boardId').value;
        return BoardProducts.find({
          boardId,
        }).count();
      }
    },
  },
  status: {
    type: Number,
    defaultValue: 1,
  },
  surl: { // the raw, scraped url
    type: String,
    optional: true,
    //regEx: SimpleSchema.RegEx.Url
  },
  type: {
    type: Number,
    defaultValue: 1,
  },
});

BoardProducts.attachSchema(Schema);
BoardProducts.attachSchema(
  ProductSchema.pick([
    'domain',
    'network',
    'price',
    'retailer',
    'retailer411',
    'returnpol',
    'status',
    'title',
    'url',
    'userId',
  ])
);
BoardProducts.attachBehaviour('softRemovable');
BoardProducts.attachBehaviour('timestampable', {
  createdAt: 'createdAt',
  createdBy: false,
  updatedAt: 'updatedAt',
  updated: 'updatedBy',
  systemId: '0',
});


BoardProducts.helpers({
  // Hack around image sort
  getCollection() {
    return BoardProducts;
  },

  isPublic() {
    return this.type === 0;
  },

  isPrivate() {
    return this.type === 1;
  },

  /*
   * Mutations
   */
  move(newIndex, callback) {
    Meteor.call('boardProducts.move', this._id, this.sort, newIndex, callback);
  },
  remove() {
    Meteor.call('boardProducts.remove', this._id);
  },
});

/*
 * Calculated field resets
 */
BoardProducts.resetAllStatuses = () => {
  BoardProducts.find().forEach((bp) => {
    const board = Boards.findOne({ _id: bp.boardId });
    if (board) {
      BoardProducts.direct.update({ _id: bp._id }, { $set: { type: board.type } });
    }
  });
};

BoardProducts.resetAllTypes = () => {
  BoardProducts.find().forEach((bp) => {
    const board = Boards.findOne({ _id: bp.boardId });
    if (board) {
      BoardProducts.direct.update({ _id: bp._id }, { $set: { status: board.status } });
    }
  });
};

BoardProducts.resetAllSort = () => {
  Boards.find().forEach((b) => {
    BoardProducts.find({ boardId: b._id }, { sort: { sort: 1, createdAt: -1 } }).forEach((bp, i) => {
      BoardProducts.direct.update({ _id: bp._id }, { $set: { sort: i } });
    });
  });
};

BoardProducts.attachQueryHelpers({
  canAccess(options) {
    const { userId } = options;
    const or = [];
    or.push({ type: 0 });
    if (userId) {
      or.push({ favoritedByIds: { $in: [userId] } });
      or.push({ creatorId: userId });
      or.push({ boardCreatorId: userId });
      or.push({ invitedIds: { $in: [userId] } });
    }

    // Ideally this would be a combination of public, private, favorited and invited
    return [{
      $and: [{
        $or: or,
      }],
    }, {}, {}];
  },

  byId(options) {
    const { _id } = options;
    check(_id, String);
    return [{ _id }, {}, {}];
  },
  notBoardProductId(options) {
    const { notBoardProductId } = options;
    check(notBoardProductId, String);
    return [{ _id: { $ne: notBoardProductId } }, {}, {}];
  },
  byBoardId(options) {
    const { boardId } = options;
    check(boardId, String);
    return [{ boardId }, {}, {}];
  },
  byProductId(options) {
    const { productId } = options;
    check(productId, String);
    return [{ productId }, {}, {}];
  },
  byBoardProductId(options) {
    const { boardProductId } = options;
    check(boardProductId, String);
    return [{ _id: boardProductId }, {}, {}];
  },
  byCategory(options) {
    const { category } = options;
    return category ? [{ category }, {}, {}] : [{},{},{}];
  },
  byKeyword(options) {
    const { keyword } = options;
    if (!keyword) { return [{}, {}, {}]; }

    const search = (keyword || '').split(' ').map((partial) => {
      const re = { $regex: new RegExp(partial, 'i'), $options: 'i' };
      return { $or: [
        { caption: re },
        { 'creator.username': re },
        { title: re },
        { retailer: re },
      ] };
    });
    return [{ $and: search }, {}, {}];
  },
  notOwnedBy(options) {
    return [{ creatorId: { $not: { userId } } }, {}, {}];
  },
  sorted(options) {
    if (options && options.boardId) {
      return [{}, { sort: { sort: 1, updatedAt: -1 } }, {}];
    }

    return [{}, { sort: { updatedAt: -1 } }, {}];
  },
  my(options) {
    const { userId } = options;
    return [{
      creatorId: userId,
    }, {}, {}];
  },
  followed(options) {
    const { userId } = options;
    check(userId, String);
    return [{}, {}, {}];
  },
  public(options) {
    const { userId } = options;

    return [{
      type: 0,
      creatorId: { $ne: userId },
    }, {}, {}];
  },
  all(options) {
    const { userId } = options;
    // Everything accessible that's not owned
    return [{
      $or: [
        { favoritedByIds: { $in: [userId] } },
        { type: 0 },
      ],
    }, {}, {}];
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
});

if (Meteor.isServer) {
  BoardProducts._ensureIndex({
    boardId: 1,
    sort: 1,
  });

  BoardProducts._ensureIndex({
    caption: 'text',
    'creator.username': 'text',
    title: 'text',
    retailer: 'text',
  });
  BoardProducts._ensureIndex({ updatedAt: -1 });
  BoardProducts._ensureIndex({ creatorId: 1 });
  BoardProducts._ensureIndex({ invitedIds: 1 });

  BoardProducts.after.remove((userId, doc) => {
    const filter = { sort: { $gt: doc.sort } };
    const modifier = { $inc: { sort: -1 } };
    const params = { multi: true };
    BoardProducts.update(filter, modifier, params);
  }, { fetchPrevious: true });
}

export default BoardProducts;
