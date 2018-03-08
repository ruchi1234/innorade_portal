import { Migrations } from 'meteor/percolate:migrations';
import Boards from '/imports/modules/boards/collection';

Migrations.add({
  version: 35,
  name: 'Lock all boards',
  up: () => {
    Boards.update({}, {$set: { status: 1 } }, { multi: true });
  },
});
