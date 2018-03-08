import { Meteor } from 'meteor/meteor';
import { Migrations } from 'meteor/percolate:migrations';
import Boards from '/imports/modules/boards/collection';
import Products from '/imports/modules/products/collection';
import Clips from '/imports/modules/clips/collection';

Migrations.add({
  version: 22,
  name: 'Migrate board contributors into separate array\'s',
  up: () => {
    Clips.find().forEach((doc) => {
      const creator = Meteor.users.findOne(doc.creatorId);
      if (creator) {
        Clips.update(
          { _id: doc._id },
          { $set: { creator: creator.denormalizedDoc() } }
        );
      }
    });

    Boards.find().forEach((doc) => {
      const creator = Meteor.users.findOne(doc.creatorId);
      if (creator) {
        Boards.update(
          { _id: doc._id },
          { $set: { creator: creator.denormalizedDoc() } }
        );
      }
    });

    Products.find().forEach((doc) => {
      const creator = Meteor.users.findOne(doc.creatorId);
      if (creator) {
        Products.update(
          { _id: doc._id },
          { $set: { creator: creator.denormalizedDoc() } }
        );
      }
    });
  },
});
