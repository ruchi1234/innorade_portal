import { Migrations } from 'meteor/percolate:migrations';
import Boards from '/imports/modules/boards/collection';

Migrations.add({
  version: 26,
  name: 'User favorites count',
  up: () => {
    Boards.resetAllImages();
  },
});

