import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import { SimpleSchema } from 'meteor/aldeed:simple-schema';
import Contacts from '/imports/modules/contacts/collection';
import { CalculateQuery } from '/imports/modules/calculate_query';

// These are contacts that are only known by their email
const Collection = new Mongo.Collection('contact_email');

const Schema = new SimpleSchema({
  userId: {
    type: String,
  },
  email: {
    type: SimpleSchema.RegEx.Email,
  },
});

Collection.attachSchema(Schema);

Collection.ensureExists = (doc) => {
  if (!Collection.findOne(doc)) {
    const usersByEmailsQ = CalculateQuery(
      Meteor.users.queryHelpers,
      ['byEmails'],
      { emails: [doc.email] }
    );
    const contact = Meteor.users.findOne(...usersByEmailsQ);
    // Basically if user is in system, use real contact record instead of
    // email contact record.
    if (contact) {
      const c = { contactId: contact._id, userId: doc.userId };
      Contacts.ensureExists(c);
    } else {
      Collection.insert(doc);
    }
  }
};

if (Meteor.isServer) {
  Collection._ensureIndex({ userId: 1 });
}

export default Collection;
