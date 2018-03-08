import { DEFAULT_LIMIT } from '/imports/startup/vars';
import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import { check } from 'meteor/check';

// Require our mongo collection extensions
import '/imports/startup/mongo_collection_extensions';
import BoardProducts from '/imports/modules/clips/collection';
import attachCreatorBehavior from '/imports/modules/collection_behaviors/creator';
import attachContributableBehavior from '/imports/modules/collection_behaviors/contributable';
import attachFavoritableBehavior from '/imports/modules/collection_behaviors/favoritable';
import attachTopBehavior from '/imports/modules/collection_behaviors/can_be_top';
import attachImagesBehavior from '/imports/modules/collection_behaviors/images';

const Boards = new Mongo.Collection('boards');

attachCreatorBehavior(Boards);
attachContributableBehavior(Boards);
attachFavoritableBehavior(Boards);
attachTopBehavior(Boards);
attachImagesBehavior(Boards);

SimpleSchema.debug = true;

const Schema = new SimpleSchema({
  answers: {
    type: [Object],
    optional: true,
  },
  'answers.$.question': {
    type: String,
    optional: true,
  },
  'answers.$.answer': {
    type: String,
    optional: true,
  },
  boardProductCount: {
    type: Number,
    autoValue: function () {
      if (this.isInsert) {
        return 0;
      } else {
        if (!this.isFromTrustedCode) {
          this.unset();
        }
      }
    },
  },
  boardProductImages: {
    type: [Mavenx.schemas.ImageRef],
    blackbox: true,
    optional: true,
    autoValue: function () {
      if (this.isInsert) {
        return [];
      } else {
        if (!this.isFromTrustedCode) {
          this.unset();
        }
      }
    },
  },
  caption: {
    type: String,
    optional: true,
  },
  categoryId: {
    type: String,
    optional: true,
    // regEx: SimpleSchema.RegEx.Id,
  },
  clipFavoritedByIds: {
    type: [String],
    defaultValue: [],
  },
  contributorIds: {
    type: [SimpleSchema.RegEx.Id],
    defaultValue: [],
  },
  invitedIds: {
    type: [SimpleSchema.RegEx.Id],
    defaultValue: [],
  },
  // NOTE: this is dropped in favor of seperate BoardProduct schema listed after Product model
  products: {
    type: [String],
    optional: true,
    defaultValue: [],
  },
  // products: {
  //     //type: [Mavenx.both.Schema.BoardProduct],
  //     type: [Object],
  //     blackbox: true,
  //     optional: true
  // },
  // status: 0 for open, 1 closed / private, 3 logical delete, 4 orphaned
  status: {
    type: Number,
    optional: true,
  },
  // title: assigned 1-liner titling the board
  title: {
    type: String,
    optional: true,
  },
  title_sort: {
    type: String,
    optional: true,
    autoValue: function () {
      const title = this.field('title');
      if (title.isSet) {
        if (title.value) {
          return title.value.toLowerCase();
        }
      } else {
        this.unset(); // Prevent user from supplying her own value
      }
    },
  },
  // type: 0 public, 1 private
  type: {
    type: Number,
    optional: false,
  },
  // FIXME: phase this out!
  // userId: shortcut to the Id of the user who created the board
  userId: {
    type: String,
    optional: true,
    regEx: SimpleSchema.RegEx.Id,
  },
});

Boards.attachSchema(Schema);
Boards.attachBehaviour('softRemovable');
Boards.attachBehaviour('timestampable', {
  createdAt: 'createdAt',
  createdBy: false,
  updatedAt: 'updatedAt',
  updated: 'updatedBy',
  systemId: '0',
});

Boards.helpers({
  // Hack around image sort
  getCollection() {
    return Boards;
  },

  boardProducts() {
    return BoardProducts.sorted(this._id);
  },

  getImages() {
    if (!this.images || !this.boardProductImages) {
      return (this.boardProductImages || this.images || []);
    }
    return [...this.images, ...this.boardProductImages];
  },

  getBoardProductImage() {
    if (this.boardProductImages && this.boardProductImages.length > 0) {
      return this.boardProductImages[0] && this.boardProductImages[0].href;
    }
  },

  isPublic() {
    return this.type === 0;
  },

  isPrivate() {
    return this.type === 1;
  },

});

/*
 * Find helpers
 *
 * Check parameters just to help with dev debugging
 */
Boards.attachQueryHelpers({
  byId(options) {
    const { _id } = options;
    check(_id, String);
    return [{ _id }, {}, {}];
  },
  /*
   * filters
   */
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
        { 'creator.slug': re },
      ] };
    });
    return [{ $and: search }, {}, {}];
  },

  /*
   * Controllers
   */
  canAccess(options) {
    const { userId } = options;
    const or = [];
    or.push({ type: 0 });
    if (userId) {
      or.push({ favoritedByIds: { $in: [userId] } });
      or.push({ clipFavoritedByIds: { $in: [userId] } });
      or.push({ creatorId: userId });
      or.push({ invitedIds: { $in: [userId] } });
    }

    // Ideally this would be a combination of public, private, favorited and invited
    return [{
      $and: [{
        $or: or,
      }],
    }, {}, {}];
  },
  public(options) {
    const { userId } = options;
    return [{ $or: [{
      type: 0,
    }, {
      type: 1,
      $or: [
        { favoritedByIds: { $in: [userId] } },
        { invitedIds: { $in: [userId] } },
      ],
    }],
    }, {}, {}];
  },
  private(options) {
    const { userId } = options;
    return [{
      creatorId: userId,
      type: 1,
    }, {}, {}];
  },
  all(options) {
    const { userId } = options;
    // Everything accessible that's not owned
    return [{
      $and: [{
        $or: [
          { favoritedByIds: { $in: [userId] } },
          { type: 0 },
        ],
      }, {
        // Logical equivalent to
        // not private and no board products
        $or: [{
          status: 0,
        }, {
          boardProductCount: { $gt: 0 },
        }],
      }],
    }, {}, {}];
  },
  myFavoriteBoards(options) {
    const { userId } = options;
    return [{
      $or: [{
        $and: [
          { favoritedByIds: { $in: [userId] } },
          { creatorId: userId },
        ],
      }, {
        $and: [
          { favoritedByIds: { $in: [userId] } },
          { status: 0 },
        ],
      }],
    }, {}, {}];
  },
  open(options) {
    const { userId } = options;
    return [{
      status: 0,
      $or: [
        { favoritedByIds: { $in: [userId] } },
        { type: 0 },
      ],
    }, {}, {}];
  },
  my(options) {
    const { userId } = options;
    return [{
      creatorId: userId,
    }, {}, {}];
  },

  // slug(options) {
  //   const { slug } = options;
  //   return [{
  //     'creator.slug': slug,
  //   }, {}, {}];
  // },

  slug(options) {
    const { slug, userId } = options;
    return [{ $or: [{
      'creator.slug': slug,
      type: 0,
    }, {
      type: 1,
      'creator.slug': slug,
      $or: [
        { favoritedByIds: { $in: [userId] } },
        { invitedIds: { $in: [userId] } },
      ],
    }],
    }, {}, {}];
  },

  /*
   * Options
   */
  sorted() {
    return [{}, { sort: { updatedAt: -1 } }, {}];
  },
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
  Boards._ensureIndex({ updatedAt: -1 });
  Boards._ensureIndex({
    caption: 'text',
    'creator.username': 'text',
    title: 'text',
    retailer: 'text',
  });
}

export default Boards;
