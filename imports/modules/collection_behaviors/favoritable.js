import { Meteor } from 'meteor/meteor';
import { _ } from 'meteor/underscore';
import { SimpleSchema } from 'meteor/aldeed:simple-schema';

const Schema = new SimpleSchema({
  favoritedByIds: {
    type: [SimpleSchema.RegEx.Id],
    optional: true,
  },
  favoritedCount: {
    type: Number,
    defaultValue: 0,
  },
});

const Helpers = {
  userFavorite(userId = Meteor.userId()) {
    return _.contains(this.favoritedByIds, userId);
  },
};

const attachBehaviour = (Collection) => {
  Collection.attachSchema(Schema);
  Collection.helpers(Helpers);

  Collection.attachQueryHelpers({
    favorite(options) {
      const { userId } = options;
      return [{
        favoritedByIds: { $in: [userId] },
      }, {}, {}];
    },
  });

  if (Meteor.isServer) {
    // Why didn't I do this before?
    Collection.after.update(function (userId, doc) {
      const length = (doc.favoritedByIds || []).length;
      const prevLength = (this.previous.favoritedByIds || []).length;
      if (length !== prevLength) {
        Collection.update({
          _id: doc._id,
        }, {
          $set: {
            favoritedCount: length,
          },
        });
      }
    });

    Collection._ensureIndex({ favoritedByIds: 1 });
    Collection._ensureIndex({ favoritedCount: 1 });
  }
};

export default attachBehaviour;
export { Schema };
