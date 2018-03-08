import { Meteor } from 'meteor/meteor';
import { _ } from 'meteor/underscore';
import { SimpleSchema } from 'meteor/aldeed:simple-schema';
import DenormUserHelpers from '/imports/modules/denorm_user_helpers';
import { ParentToChild } from '/imports/modules/denormalize';

const Schema = new SimpleSchema({
  creator: {
    type: Object,
    blackbox: true,
    defaultValue: {},
  },
  creatorId: {
    type: SimpleSchema.RegEx.Id,
    autoValue() {
      if (this.isInsert) {
        if (!this.isSet) {
          return this.userId;
        }
      } else {
        this.unset();
      }
    },
  },
});

const Helpers = {
  getCreator() {
    return DenormUserHelpers(this.creator || {});
  },
};

SimpleSchema.debug = true;
const attachBehaviour = (Collection) => {
  Collection.attachSchema(Schema);
  Collection.helpers(Helpers);

  ParentToChild({
    parentCollection: Meteor.users,
    shouldUpdate(parentDoc, previousParentDoc) {
      return !_.isEqual(
        Meteor.users._transform(parentDoc).denormalizedDoc(),
        Meteor.users._transform(previousParentDoc).denormalizedDoc()
      );
    },

    childCollection: Collection,
    childFieldName: 'creatorId',
    calcModifier(parentDoc) {
      return { $set: { creator: Meteor.users._transform(parentDoc).denormalizedDoc() } };
    },
  });

  if (Meteor.isServer) {
    Collection._ensureIndex({ 'creator.username': 1 });
    Collection._ensureIndex({ 'creator.slug': 1 });
    Collection._ensureIndex({ creatorId: 1 });
  }
};

export default attachBehaviour;
export { Schema };
