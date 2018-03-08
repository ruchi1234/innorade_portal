import { Migrations } from 'meteor/percolate:migrations';
import { _ } from 'meteor/underscore';

import Boards from '/imports/modules/boards/collection';
import Products from '/imports/modules/products/collection';
import Clips from '/imports/modules/clips/collection';

const favoritedByIds = (doc) => {
  if (!doc.contributor) { return []; }

  const favorites = [];
  doc.contributor.forEach((user) => {
    if (user.role === 'favoritor') {
      favorites.push(user);
    }
  });
  return _.map(favorites, (f) => f.userId);
};

Migrations.add({
  version: 21,
  name: 'Migrate board contributors into separate array\'s',
  up: () => {
    Clips.find().forEach((doc) => {
      Clips.direct.update(
        { _id: doc._id },
        { $set: { favoritedByIds: favoritedByIds(doc) } }
      );
    });

    Boards.find().forEach((doc) => {
      Boards.direct.update(
        { _id: doc._id },
        { $set: { favoritedByIds: favoritedByIds(doc) } }
      );
    });

    Products.find().forEach((doc) => {
      Products.direct.update(
        { _id: doc._id },
        { $set: { favoritedByIds: favoritedByIds(doc) } }
      );
    });
  },
});
