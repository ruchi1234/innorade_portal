import BoardProducts from '/imports/modules/clips/collection';
import { SimpleSchema } from 'meteor/aldeed:simple-schema';
import { ValidatedMethod } from 'meteor/mdg:validated-method';

export default new ValidatedMethod({
  name: 'boardProducts/favorite',

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
      BoardProducts.update({ _id }, {
        $addToSet: {
          favoritedByIds: this.userId,
        },
      });
    } else {
      BoardProducts.update({ _id }, {
        $pull: {
          favoritedByIds: this.userId,
        },
      });
    }
  },
});
