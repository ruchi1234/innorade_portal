import { Migrations } from 'meteor/percolate:migrations';
import Boards from '/imports/modules/boards/collection';
import Clips from '/imports/modules/clips/collection';
// import SimpleSchema from 'meteor/aldeed:simpleschema';

Migrations.add({
  version: 33,
  name: 'Recalculate all denormalized board titles on products',
  up: () => {
    SimpleSchema.debug = true;
    Clips.find().forEach((c) => {
      const b = Boards.findOne(c.boardId);
      if (b) {
        Clips.direct.update({ _id: c._id }, { $set: { boardTitle: b.title } });
      }
    });
  },
});
