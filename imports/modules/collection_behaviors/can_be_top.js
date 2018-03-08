import { Meteor } from 'meteor/meteor';
import { SimpleSchema } from 'meteor/aldeed:simple-schema';

const Schema = new SimpleSchema({
  isTop: {
    type: Boolean,
    defaultValue: false,
    denyUpdate: true,
  },
});

export default (Collection) => {
  Collection.attachSchema(Schema);

  Collection.attachQueryHelpers({
    top(options) {
      const { userId } = options;
      return [{
        $and: [{
          isTop: true,
          $or: [
            // public or favorited
            { favoritedByIds: { $in: [userId] } },
            { type: 0 },
          ],
        }, {
          // Logical equivalent to
          // not private and no board products
          $or: [{
            status: 0,
          }, {
            boardProductCount: { $gt: 0 },
          }],
        }],
      }, {}, {}];
    },
  });

  if (Meteor.isServer) {
    Collection._ensureIndex({ isTop: 1 });
  }
};
