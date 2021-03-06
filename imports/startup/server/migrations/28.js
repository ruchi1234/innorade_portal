import Boards from '/imports/modules/boards/collection';
import { Migrations } from 'meteor/percolate:migrations';
import Clips from '/imports/modules/clips/collection';

Migrations.add({
  version: 28,
  name: 'Reset board invitation ids onto clips',
  up() {
    Clips.find().forEach((c) => {
      const b = Boards.findOne(c.boardId);
      if (b && b.invitedIds) {
        Clips.direct.update({ _id: c._id }, { $addToSet: {
          invitedIds: { $each: b.invitedIds },
        } });
      }
    });
  },
});
