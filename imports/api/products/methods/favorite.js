import Products from '/imports/modules/products/collection';
import { SimpleSchema } from 'meteor/aldeed:simple-schema';
import { ValidatedMethod } from 'meteor/mdg:validated-method';

const Favorite = new ValidatedMethod({
  name: 'products/favorite',

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
      try {
        Products.update({ _id }, {
          $addToSet: {
            favoritedByIds: this.userId,
          },
        });
      } catch (e) {
        // console.log('error!', e);
      }
    } else {
      Products.update({ _id }, {
        $pull: {
          favoritedByIds: this.userId,
        },
      });
    }
  },
});

export default Favorite;
