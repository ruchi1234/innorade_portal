import { Meteor } from 'meteor/meteor';
import { _ } from 'meteor/underscore';

import Boards from '/imports/modules/boards/collection';
import BoardProducts from '/imports/modules/clips/collection';
import { generateBPIDAurl } from '/imports/lib/server/affiliate/affiliate_generator';
import { ParentToChild } from '/imports/modules/denormalize';

BoardProducts.setAurl = (doc) => {
  Meteor.setTimeout(() => {
    //  aurl = '';
    // if (doc.aurlType) {
    //   aurl = generateBPIDAurl(doc.domain, doc.surl, doc._id);
    // } else {
    //   aurl = generateBPIDAurl(doc.domain, doc.url, doc._id);
    // }
    const url = doc.aurlType ? doc.surl : doc.url;
    const aurl = generateBPIDAurl(doc.domain, url, doc._id);
    BoardProducts.update(
      { _id: doc._id },
      { $set: { aurl } }
    );
  }, 2);
};

const hookUpdatePrevious = (userId, doc) => { BoardProducts.setAurl(doc); };
const hookDontFetchPrev = { fetchPrevious: false };
BoardProducts.after.insert(hookUpdatePrevious, hookDontFetchPrev);

/*
 * Denormalize open and status from boards
 * to child boadProducts
 */
BoardProducts.resetAllBoardContributors = () => {
  BoardProducts.find().forEach((bp) => {
    const board = Boards.findOne({ _id: bp.boardId });
    if (board) {
      BoardProducts.direct.update({ _id: bp._id }, { $set: { boardContributorIds: board.contributorIds } });
    }
  });
};

ParentToChild({
  parentCollection: Boards,
  shouldUpdate(parentDoc, previousParentDoc) {
    return !_.isEqual(
      _.pick(parentDoc, 'creator', 'creatorId', 'type', 'status'),
      _.pick(previousParentDoc, 'creator', 'creatorId', 'type', 'status')
    );
  },

  childCollection: BoardProducts,
  childFieldName: 'boardId',
  calcModifier: (parentDoc) => ({ $set:
    { boardContributorIds: parentDoc.contributorIds, type: parentDoc.type, status: parentDoc.status },
  }),
});

ParentToChild({
  parentCollection: Boards,
  shouldUpdate(parentDoc, previousParentDoc) {
    return !_.isEqual(
      _.pick(parentDoc, 'removed', 'removedAt'),
      _.pick(previousParentDoc, 'removed', 'removedAt')
    );
  },

  childCollection: BoardProducts,
  childFieldName: 'boardId',
  calcModifier: (parentDoc) => {
    if (parentDoc.removed || parentDoc.removedAt) {
      return { $set: {
        removed: parentDoc.removed,
        removedAt: parentDoc.removedAt,
      } };
    } else {
      return { $unset: {
        removed: 1,
        removedAt: 1,
      } };
    }
  },
});

ParentToChild({
  parentCollection: Boards,
  shouldUpdate(parentDoc, previousParentDoc) {
    return !_.isEqual(
      _.pick(parentDoc, 'invitedIds'),
      _.pick(previousParentDoc, 'invitedIds')
    );
  },

  childCollection: BoardProducts,
  childFieldName: 'boardId',
  calcModifier: (parentDoc) => {
    if (parentDoc.invitedIds) {
      return { $addToSet: {
        invitedIds: { $each: parentDoc.invitedIds },
      } };
    }
  },
});

ParentToChild({
  parentCollection: Boards,
  shouldUpdate(parentDoc, previousParentDoc) {
    return !_.isEqual(
      _.pick(parentDoc, 'title'),
      _.pick(previousParentDoc, 'title')
    );
  },

  childCollection: BoardProducts,
  childFieldName: 'boardId',
  calcModifier: (parentDoc) => ({ $set: { boardTitle: parentDoc.title } }),
  directUpdate: true,
});
