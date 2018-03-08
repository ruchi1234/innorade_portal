import Retailers from '/imports/modules/retailers/collection';
import Clips from '/imports/modules/clips/collection';

Migrations.add({
  version: 31,
  name: 'Add aurlType',
  up: () => {
    Retailers.find().forEach((b) => {
      Retailers.direct.update({ _id: b._id }, { $set: {
        aurlType: 0,
      } });
    });

    Clips.find().forEach((b) => {
      Clips.direct.update({ _id: b._id }, { $set: {
        aurlType: 0,
        surl: b.url,
      } });
    });
  },
});
