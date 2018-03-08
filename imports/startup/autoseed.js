import Categories from '/imports/modules/categories/collection';
import { Meteor } from 'meteor/meteor';
import Boards from '/imports/modules/boards/collection';
import Products from '/imports/modules/products/collection';
import BoardProducts from '/imports/modules/clips/collection';
import Seed from './seed';

if (Meteor.isDevelopment) {
  if (!Categories.find().count()) {
    _.each(JSON.parse(Assets.getText('exports/category_export.json')), (c, i) => {
      c.status = c.status ? 1 : 0;
      c.order = i;
      Categories.insert(c);
    });
  }

  if (!Meteor.users.find().count()) {
    Seed.Users();
  }

  if (!Boards.find().count()) {
    Seed.Boards();
  }

  if (!Products.find().count()) {
    Seed.Products();
  }

  if (!BoardProducts.find().count()) {
    Seed.BoardProducts();
  }
}
