import { Meteor } from 'meteor/meteor';

import Boards from '/imports/modules/boards/collection';

Migrations.add({
  version: 25,
  name: 'Update images to account for clips with no images.',
  up: () => {
    Boards.resetAllImages();
  },
});
