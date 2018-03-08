import Meteor from 'meteor/meteor';
import { Migrations } from 'meteor/percolate:migrations';
import { _ } from 'meteor/underscore';

import Boards from '/imports/modules/boards/collection';
import Products from '/imports/modules/products/collection';
import Clips from '/imports/modules/clips/collection';

const creatorId = (doc) => {
  const creator = _.find(doc.contributor, (c) =>
    c.role === 'creator'
  );
  return creator ? creator.userId : 'vKwxruW9BTCMJjNvS';
};

const Migration = () => {
  Clips.find().forEach((doc) => {
    Clips.update(
      { _id: doc._id },
      { $set: { creatorId: creatorId(doc) } },
      { bypassCollection2: true }
    );
  });

  Boards.find().forEach((doc) => {
    Boards.update(
      { _id: doc._id },
      { $set: { creatorId: creatorId(doc) } },
      { bypassCollection2: true }
    );
  });

  Products.find().forEach((doc) => {
    Products.update(
      { _id: doc._id },
      { $set: { creatorId: creatorId(doc) } },
      { bypassCollection2: true }
    );
  });
};


Migrations.add({
  version: 20,
  name: 'Migrate board contributors into separate array\'s',
  up: Migration,
});


export { Migration };
