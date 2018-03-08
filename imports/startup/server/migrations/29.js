import Boards from '/imports/modules/boards/collection';
import { Migrations } from 'meteor/percolate:migrations';
import Clips from '/imports/modules/clips/collection';


Migrations.add({
  version: 29,
  name: 'Set clip boardCreatorIds',
  up() {
    Clips.find().forEach((c) => {
      const b = Boards.findOne(c.boardId);
      if (b) {
        Clips.direct.update({ _id: c._id }, { $set: {
          boardCreatorId: b.creatorId,
        } });
      }
    });
  },
});
