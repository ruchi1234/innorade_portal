import { Meteor } from 'meteor/meteor';
// import Boards from '/imports/modules/boards/collection';
import BoardProducts from '/imports/modules/clips/collection';
import { CalculateQuery } from '/imports/modules/calculate_query';
import { check } from 'meteor/check';
import { Match } from 'meteor/check';

const getProductClipCount = (userId, productId) =>
  BoardProducts.find({ userId, productId }).count();

Meteor.publish('boardProducts/byId', function (_id) {
  check(_id, String);

  const params = { _id, userId: this.userId };
  const query = CalculateQuery(BoardProducts.queryHelpers, ['byId'], params);
  return BoardProducts.find(...query);
});

Meteor.publish('boardProducts/byProductId', function (productId) {
  check(productId, String);

  const params = { productId };
  const query = CalculateQuery(BoardProducts.queryHelpers, ['byProductId'], params);
  return BoardProducts.find(...query);
});

Meteor.publish('boardProductsByKeyword', function (keyword, queryHelpers, category, page) {
  check(keyword, String);
  check(queryHelpers, [String]);
  check(category, Match.OneOf(undefined, null, String));
  check(page, Number);
  queryHelpers.push('sorted', 'limit', 'paged', 'byKeyword', 'byCategory');

  const params = {
    userId: this.userId,
    page,
    keyword,
    category,
  };
  const query = CalculateQuery(BoardProducts.queryHelpers, queryHelpers, params);
  return BoardProducts.find(...query);
});

Meteor.publish('boardProductsByBoardId', function (boardId, queryHelpers, page) {
  check(boardId, String);
  check(queryHelpers, [String]);
  check(page, Number);
  queryHelpers.push('sorted', 'limit', 'paged', 'byBoardId');

  const params = {
    page,
    userId: this.userId,
    boardId,
  };
  const query = CalculateQuery(BoardProducts.queryHelpers, queryHelpers, params);
  return BoardProducts.find(...query);
});
