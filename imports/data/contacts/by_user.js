import { Meteor } from 'meteor/meteor';
import Subscriptions from '/imports/data/subscriptions';
import Contacts from '/imports/modules/contacts/collection';
import ContactEmails from '/imports/modules/contact_emails/collection';

export default (props, onData) => {
  const { excludedContactIds, excludedContactEmails } = props;
  const sub = Subscriptions.subscribe('contacts');
  const sub2 = Subscriptions.subscribe('contactEmails');

  const contactQuery = { userId: Meteor.userId() };
  if (excludedContactIds) {
    contactQuery.contactId = {
      $nin: excludedContactIds,
    };
  }
  const contacts = Contacts.find(contactQuery, { sort: { 'contact.username': 1 } }).fetch();

  const contactEmailQuery = { userId: Meteor.userId() };
  if (excludedContactEmails) {
    contactEmailQuery.email = {
      $nin: excludedContactEmails,
    };
  }
  const contactEmails = ContactEmails.find(contactEmailQuery, { sort: { email: 1 } }).fetch();

  onData(null, {
    contacts,
    contactEmails,
    ready: sub.ready() && sub2.ready(),
  });

  return () => { sub.stop(); sub2.stop(); };
};
