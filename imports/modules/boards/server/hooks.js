import { Meteor } from 'meteor/meteor';
import { _ } from 'meteor/underscore';
import { ChildAggregate } from '/imports/modules/denormalize';
import Boards from '/imports/modules/boards/collection';
import BoardProducts from '/imports/modules/clips/collection';

if (Meteor.isServer) {
  // TODO
  const { DenormCountField } = Mavenx.schemas;

  Boards.attachSchema(new SimpleSchema({
    boardProductsFavoritesCount: DenormCountField,
  }));

  /*
   * Board's images,
   * set from products on the board
   */
  Boards.resetImages = (boardId) => {
    const b = Boards.findOne(boardId);
    if (!b) { return; }

    // Find clips that have at least one image
    const query = { boardId, images: { $exists: 1 }, $where: 'this.images.length > 0' };
    const options = { sort: { sort: 1, created: 1 }, fields: { images: 1 }, limit: 5 };
    const boardProductImages = BoardProducts.find(query, options)
      .map((product) => _.first(product.images));

    if (!_.isEqual(boardProductImages, b.boardProductImages)) {
      Boards.direct.update({ _id: boardId }, { $set: { boardProductImages } });
    }
  };

  Boards.resetAllImages = () => {
    Boards.find({}).forEach((b) => {
      Boards.resetImages(b._id);
    });
  };

  const hookUpdatePrevious = (userId, doc) => { Boards.resetImages(doc.boardId); };
  const hookDontFetchPrev = { fetchPrevious: false };
  BoardProducts.after.insert(hookUpdatePrevious, hookDontFetchPrev);
  BoardProducts.after.update(function (userId, doc) {
    if (
        !_.isEqual(doc.images, this.previous.images) ||
        doc.sort !== this.previous.sort ||
        doc.removed !== this.previous.removed
    ) {
      console.log( 'resetting images' );
      hookUpdatePrevious(userId, doc);
    }
  });
  BoardProducts.after.remove(hookUpdatePrevious, hookDontFetchPrev);

  /*
  * Board product count
  * $inc when one comes in,
  * $inc and dec proper records on update
  * $inc -1 whe product removed
  */
  ChildAggregate({
    parentField: 'boardProductCount',
    parentCollection: Boards,

    childCollection: BoardProducts,
    childValue(childDoc) { return !childDoc.removed ? 1 : 0; },
    childParentField: 'boardId',
  });


  ChildAggregate({
    parentField: 'boardProductsFavoritesCount',
    parentCollection: Boards,

    childCollection: BoardProducts,
    childValue(childDoc) {
      const bp = BoardProducts._transform(childDoc);
      return bp.favoritedByIds ? bp.favoritedByIds.length : 0;
    },
    childParentField: 'boardId',
  });

  Boards.resetAllBoardProductCounts = () => {
    Boards.find().forEach((b) => {
      const count = BoardProducts.find({ boardId: b._id }).count();
      Boards.update({ _id: b._id }, {
        $set: { boardProductCount: count },
      });
    });
  };

  Boards.resetAllBoardProductsFavoritesCounts = () => {
    Boards.find().forEach((b) => {
      let count = 0;
      BoardProducts.find({ boardId: b._id }).forEach((bp) => {
        count = count + bp.favoritedByIds.length;
      });
      Boards.update({ _id: b._id }, {
        $set: { boardProductsFavoritesCount: count },
      });
    });
  };

  /*
   * If they favorite a clip, add to array on board so we can
   * give them access
   */
  BoardProducts.after.update((userId, doc) => {
    const board = Boards.findOne(doc.boardId);
    if (board) {
      const diff = _.difference(doc.favoritedByIds, board.favoritedByIds);
      if (diff.length) {
        Boards.update({ _id: doc.boardId }, { $addToSet: { clipFavoritedByIds: { $each: diff } } });
      }
    }
  });

  /*
   * If they favorite a clip, add to array on board so we can
   * give them access
   */
  BoardProducts.after.update((userId, doc) => {
    const board = Boards.findOne(doc.boardId);
    if (board) {
      const diff = _.difference(doc.invitedIds, board.invitedIds);
      if (diff.length) {
        Boards.update({ _id: doc.boardId }, { $addToSet: { invitedIds: { $each: diff } } });
      }
    }
  });
}
