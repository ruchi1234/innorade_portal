import { Meteor } from 'meteor/meteor';

import Products from '/imports/modules/products/collection';
import Boards from '/imports/modules/boards/collection';
import Clips from '/imports/modules/clips/collection';

Migrations.add({
  version: 24,
  name: 'Update user denormalizations.',
  up: () => {
    Clips.find().forEach((clip) => {
      const user = Meteor.users.findOne(clip.creatorId);
      if (user) {
        Clips.update({ _id: clip._id }, { $set: { creator: user.denormalizedDoc() } });
      }
    });
    Boards.find().forEach((board) => {
      const user = Meteor.users.findOne(board.creatorId);
      if (user) {
        Boards.update({ _id: board._id }, { $set: { creator: user.denormalizedDoc() } });
      }
    });
    Products.find().forEach((p) => {
      const user = Meteor.users.findOne(p.creatorId);
      if (user) {
        Products.update({ _id: p._id }, { $set: { creator: user.denormalizedDoc() } });
      }
    });
  },
});
