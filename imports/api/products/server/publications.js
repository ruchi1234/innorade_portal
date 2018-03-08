import { Meteor } from 'meteor/meteor';
import Products from '/imports/modules/products/collection';
import Clips from '/imports/modules/clips/collection';
import { check, Match } from 'meteor/check';
import { CalculateQuery } from '/imports/modules/calculate_query';

Meteor.publish('products.byId', function (_id) {
  check(_id, Match.Optional(String));

  const params = { _id };
  const query = CalculateQuery(Products.queryHelpers, ['byId'], params);

  return Products.find(...query);
});

Meteor.publish('productsByKeyword', function (keyword, queryHelpers, page) {
  check(keyword, String);
  check(queryHelpers, [String]);
  check(page, Number);
  queryHelpers.push('sorted', 'limit', 'paged', 'byKeyword');

  const params = {
    userId: this.userId,
    page,
    keyword,
  };
  const query = CalculateQuery(Products.queryHelpers, queryHelpers, params);
  const p = Products.find(...query);
  return p;
});

const getHero = (userId, productId) => {
  const pubcount = Clips.find(
    { creatorId: userId, productId },
    { fields: { _id: 1 } }
  ).count();
  const clips = Clips.find(
    { creatorId: userId, productId },
    { sort: { createdAt: -1 }, fields: { images: 1, title: 1, favoritedByIds: 1, aurl: 1 } }
  ).fetch();
  let favoriteCount = 0;
  clips.forEach((c) => {
    if (c && c.favoritedByIds && c.favoritedByIds.length > 0) {
      favoriteCount += c.favoritedByIds.length;
    }
  });

  return ({
    favoriteCount,
    clipId: clips && clips[0] && clips[0]._id || '',
    heroImage: clips && clips[0] && clips[0].getImage(),
    title: clips && clips[0] && clips[0].title || '',
    aurl: clips && clips[0] && clips[0].aurl || '',
    clipCount: pubcount,
    caption: clips && clips[0] && clips[0].caption,
  });
};

Meteor.publish('myProducts', function (keyword, queryHelpers, page) {
  check(keyword, String);
  check(queryHelpers, [String]);
  check(page, Number);
  queryHelpers.push('sorted', 'limit', 'paged', 'byKeyword');

  const pub = this;
  const userId = this.userId;
  const params = {
    page,
    userId,
    keyword,
  };

  const query = CalculateQuery(Products.queryHelpers, queryHelpers, params);

  const cursor = Products.find(...query).observeChanges({
    added: function (id, fields) {
      fields.clip = getHero(userId, id);
      pub.added('products', id, fields);
    },
    changed: function (id, fields) {
      fields.clip = getHero(userId, id);
      pub.changed('products', id, fields);
    },
    removed: function (id) {
      pub.removed('products', id);
    },
  });

  pub.ready();

  pub.onStop(function () {
    cursor.stop();
  });
});
