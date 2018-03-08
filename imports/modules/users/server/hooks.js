import { Meteor } from 'meteor/meteor';
import { _ } from 'meteor/underscore';
import Boards from '/imports/modules/boards/collection';
import BoardProducts from '/imports/modules/clips/collection';
import { ChildAggregate } from '/imports/modules/denormalize';

const { DenormCountField } = Mavenx.schemas;

/*
 * Denormalizatino field resets
 */
Meteor.users.resetAllBoardProductsFavoritesCounts = () => {
  Meteor.users.find({}).forEach((u) => {
    const count = BoardProducts.find({
      favoritedByIds: { $in: [u._id] },
    }).count();

    Meteor.users.update({ _id: u._id }, {
      $set: { 'profile.clipsFavoritesCount': count },
    });
  });
};


/*
 * Tracks total times a user has liked any board product.
 */
BoardProducts.after.update(function incUserBPFavoriteCount(userId, doc) {
  const bp = BoardProducts._transform(doc);
  const old = BoardProducts._transform(this.previous);

  const newFavorites = bp.favoritedByIds || [];
  const oldFavorites = old.favoritedByIds || [];

  const added = _.without(newFavorites, ...oldFavorites);
  const removed = _.without(oldFavorites, ...newFavorites);

  if (added.length) {
    Meteor.users.update({ _id: { $in: added } }, {
      $inc: { 'profile.clipsFavoritesCount': 1 },
    }, { multi: true });
  }

  if (removed.length) {
    Meteor.users.update({ _id: { $in: removed } }, {
      $inc: { 'profile.clipsFavoritesCount': -1 },
    }, { multi: true });
  }
});

BoardProducts.after.remove((userId, doc) => {
  const bp = BoardProducts._transform(doc);
  Meteor.users.update({ _id: {
    $in: bp.favoritedByIds,
  } }, {
    $inc: { 'profile.clipsFavoritesCount': -1 },
  }, { multi: true });
});


/*
 * Track number of times a users owned boards have been favorited
 */
Meteor.users.attachSchema({
  'profile.clipFavoritedCount': DenormCountField,
});

ChildAggregate({
  parentField: 'profile.clipFavoritedCount',
  parentCollection: Meteor.users,

  childCollection: BoardProducts,
  childValue(childDoc) {
    const bp = BoardProducts._transform(childDoc);
    return bp.favoritedByIds ? bp.favoritedByIds.length : 0;
  },
  childParentQueryFunc(childDoc) {
    const bp = BoardProducts._transform(childDoc);
    return { _id: bp.creatorId };
  },
});

/*
 * Track boards by user
 */
Meteor.users.attachSchema({
  'profile.boardCount': DenormCountField,
});

ChildAggregate({
  parentField: 'profile.boardCount',
  parentCollection: Meteor.users,

  childCollection: Boards,
  childValue(childDoc) { return !childDoc.removed ? 1 : 0; },
  childParentField: 'creatorId',
});

/*
 * Track clips
 */
Meteor.users.attachSchema({
  'profile.clipCount': DenormCountField,
});

ChildAggregate({
  parentField: 'profile.clipCount',
  parentCollection: Meteor.users,

  childCollection: BoardProducts,
  childValue(childDoc) { return !childDoc.removed ? 1 : 0; },
  childParentField: 'creatorId',
});
