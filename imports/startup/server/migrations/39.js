import { Migrations } from 'meteor/percolate:migrations';
import Users from '/imports/modules/users/users';
import Boards from '/imports/modules/boards/collection';

Migrations.add({
  version: 39,
  name: 'Update users Board count',
  up: () => {
    Users.find().forEach((u) => {
      const b = Boards.find({'creatorId': u._id});
      console.log('b: ', b.count());
      Users.direct.update({ _id: u._id }, { $set: { 'profile.boardCount': b.count() } });
    });
  },
});
