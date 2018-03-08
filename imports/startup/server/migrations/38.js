import { Migrations } from 'meteor/percolate:migrations';
import Users from '/imports/modules/users/users';
import Clips from '/imports/modules/clips/collection';

Migrations.add({
  version: 38,
  name: 'Append slug & userFavorite to clips',
  up: () => {
    Clips.find().forEach((c) => {
      const u = Users.findOne(c.creatorId);
      if (u) {
        Clips.direct.update({ _id: c._id }, { $set: { 'creator.slug': u.slug, 'creator.favoritedCount': u.favoritedCount } });
      }
    });
  },
});
