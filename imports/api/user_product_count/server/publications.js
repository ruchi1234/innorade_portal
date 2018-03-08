import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';
import UserProductCounts from '/imports/modules/user_product_counts/collection';

Meteor.publish('userProductCounts/single', function(userId, productId) {
  check(userId, String);
  check(productId, String);
  return UserProductCounts.find({ userId, productId });
});
