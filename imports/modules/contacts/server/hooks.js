import { Meteor } from 'meteor/meteor';

import Contacts from '/imports/modules/contacts/collection';
import ContactEmails from '/imports/modules/contact_emails/collection';
import { ParentToChild } from '/imports/modules/denormalize';

/*
 * Denormalize open and status from boards
 * to child boadProducts
 */
ParentToChild({
  parentCollection: Meteor.users,
  shouldUpdate(parentDoc, previousParentDoc) {
    return !_.isEqual(
      Meteor.users._transform(parentDoc).denormalizedDoc(),
      Meteor.users._transform(previousParentDoc).denormalizedDoc()
    );
  },

  childCollection: Contacts,
  childFieldName: 'contactId',
  calcModifier: (parentDoc) => {
    return { $set: { contact: Meteor.users._transform(parentDoc).denormalizedDoc() } };
  },
});

/*
 * Keep email contacts deduped from contact emails
 *
 * No clue why the extra wrap in the hooks was needed.
 * Seems to not work without it though.
 */

const dedupEmailContact = (userId, doc) => {
  const user = Meteor.users.findOne(doc.contactId);
  if (user) {
    const emails = (user.emails || []).map((e) => e.address);
    ContactEmails.remove({ userId, email: { $in: emails } });
  }
};

Contacts.after.insert((...props) => {
  dedupEmailContact(...props);
});
Contacts.after.update((...props) => {
  dedupEmailContact(...props);
});
