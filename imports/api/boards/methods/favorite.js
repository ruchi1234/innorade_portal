import Boards from '/imports/modules/boards/collection';
import { SimpleSchema } from 'meteor/aldeed:simple-schema';
import { ValidatedMethod } from 'meteor/mdg:validated-method';

const Favorite = new ValidatedMethod({
  name: 'boards/favorite',

  validate: new SimpleSchema({
    _id: {
      type: SimpleSchema.RegEx.Id,
    },
    favorite: {
      type: Boolean,
    },
  }).validator(),

  run({ _id, favorite }) {
    if (favorite) {
      Boards.update({ _id }, {
        $addToSet: {
          favoritedByIds: this.userId,
        },
      });
    } else {
      Boards.update({ _id }, {
        $pull: {
          favoritedByIds: this.userId,
        },
      });
    }
  },
});

export default Favorite;
