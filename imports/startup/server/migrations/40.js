import { Migrations } from 'meteor/percolate:migrations';
import Users from '/imports/modules/users/users';
import Clips from '/imports/modules/clips/collection';

Migrations.add({
  version: 40,
  name: 'Update users Clip count',
  up: () => {
    Users.find().forEach((u) => {
      const c = Clips.find({'creatorId': u._id});
      console.log('c: ', c.count());
      Users.direct.update({ _id: u._id }, { $set: { 'profile.clipCount': c.count() } });
    });
  },
});
