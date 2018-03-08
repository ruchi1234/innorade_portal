import { Meteor } from 'meteor/meteor';
import { SimpleSchema } from 'meteor/aldeed:simple-schema';
import { Mongo } from 'meteor/mongo';

import Boards from '/imports/modules/boards/collection';
import BoardProducts from '/imports/modules/clips/collection';

const Invitations = new Mongo.Collection('invitations');

const Schema = new SimpleSchema({
  _id: {
    type: String,
    autoValue() {
      if (this.isInsert) {
        return Random.secret();
      }
    },
  },

  accepted: {
    type: Boolean,
    defaultValue: false,
  },
  acceptedByUserId: {
    type: SimpleSchema.RegEx.Id,
    optional: true,
  },

  // Information about who it was sent to
  email: {
    type: String,
    optional: true,
  },

  // What the invitation was for
  relatedType: {
    type: String,
    allowedValues: ['product', 'board'],
  },
  relatedId: {
    type: SimpleSchema.RegEx.Id,
  },

  // Who sent this invite
  invitingUserId: {
    type: SimpleSchema.RegEx.Id,
  },
});

Invitations.attachSchema(Schema);
Invitations.attachBehaviour('timestampable');

const TypeMappings = {
  product: {
    collection: BoardProducts,
  },
  board: {
    collection: Boards,
  },
};

Invitations.helpers({
  relatedCollection() {
    return TypeMappings[this.relatedType].collection;
  },
  relatedDocUpdate(modifier) {
    this.relatedCollection().update({ _id: this.relatedId }, modifier);
  },
});

Invitations.createLink = (options) => {
  const token = Invitations.insert(options);

  return `${Meteor.absoluteUrl()}invite/${token}`;
};

export default Invitations;
export { Schema };
