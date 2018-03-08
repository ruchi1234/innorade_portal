import Boards from '/imports/modules/boards/collection';
import Clips from '/imports/modules/clips/collection';

Migrations.add({
  version: 27,
  name: 'Track favorites count',
  up: () => {
    Boards.find().forEach((b) => {
      Boards.direct.update({ _id: b._id }, { $set: {
        favoritedCount: (b.favoritedByIds || []).length,
      } });
    });

    Clips.find().forEach((b) => {
      Clips.direct.update({ _id: b._id }, { $set: {
        favoritedCount: (b.favoritedByIds || []).length,
      } });
    });
  },
});
