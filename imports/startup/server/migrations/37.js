import { Migrations } from 'meteor/percolate:migrations';
import Users from '/imports/modules/users/users';
import Boards from '/imports/modules/boards/collection';

Migrations.add({
  version: 37,
  name: 'Append slug and favoritedCount to boards',
  up: () => {
    Boards.find().forEach((b) => {
      const u = Users.findOne(b.creatorId);
      if (u) {
        Boards.direct.update({ _id: b._id }, { $set: { 'creator.slug': u.slug, 'creator.favoritedCount': u.favoritedCount } });
      }
    });
  },
});
