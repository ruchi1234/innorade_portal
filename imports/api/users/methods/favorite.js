import Users from '/imports/modules/users/users';
import { SimpleSchema } from 'meteor/aldeed:simple-schema';
import { ValidatedMethod } from 'meteor/mdg:validated-method';

const Favorite = new ValidatedMethod({
  name: 'user/favorite',

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
      Users.update({ _id }, {
        $addToSet: {
          favoritedByIds: this.userId,
        },
      });
    } else {
      Users.update({ _id }, {
        $pull: {
          favoritedByIds: this.userId,
        },
      });
    }
  },
});

export default Favorite;
