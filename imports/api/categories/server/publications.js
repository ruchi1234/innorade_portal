import Categories from '/imports/modules/categories/collection';

Meteor.publish('categories', function() {
  return Categories.find();
});
