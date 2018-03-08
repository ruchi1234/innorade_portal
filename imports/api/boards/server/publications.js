import { Meteor } from 'meteor/meteor';
import { check, Match } from 'meteor/check';
import { CalculateQuery } from '/imports/modules/calculate_query';
import Boards from '/imports/modules/boards/collection';

Meteor.publish('boardsByKeyword', function boardByKeywordPub(keyword, queryHelpers, page, slug) {
  check(keyword, String);
  check(queryHelpers, [String]);
  check(page, Number);
  check(slug, Match.Maybe(String));
  queryHelpers.push('sorted', 'limit', 'paged', 'byKeyword');

  const params = {
    userId: this.userId,
    page,
    keyword,
    slug,
  };
  const query = CalculateQuery(Boards.queryHelpers, queryHelpers, params);
  return Boards.find(...query);
});

Meteor.publish('boards.byId', function (_id) {
  check(_id, String);

  const params = {
    _id,
    userId: this.userId,
  };
  const query = CalculateQuery(Boards.queryHelpers, ['byId'], params);

  return Boards.find(...query);
});
