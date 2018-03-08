import { Meteor } from 'meteor/meteor';
import { _ } from 'meteor/underscore';
import { SimpleSchema } from 'meteor/aldeed:simple-schema';
// import { ParentToChild } from '/imports/modules/denormalize';
// import Products from '/imports/modules/products/collection';

const Schema = new SimpleSchema({
  contributedByIds: {
    type: [SimpleSchema.RegEx.Id],
    optional: true,
  },
});

const Helpers = {
  userContributor(userId = Meteor.userId()) {
    return _.contains(this.contributedByIds, userId);
  },
};

const attachBehaviour = (Collection) => {
  Collection.attachSchema(Schema);
  Collection.helpers(Helpers);
  if (Meteor.isServer) {
    Collection._ensureIndex({ contributedByIds: 1 });

    Collection.before.insert(function (userId, doc) {
      doc.contributedByIds = [userId];
      return doc;
    });

    Collection.before.update(function (userId, doc, selector, modifier) {
      modifier.$addToSet = modifier.$addToSet || {};
      modifier.$addToSet.contributedByIds = userId;
    });
  }
};

export default attachBehaviour;
export { Schema };
