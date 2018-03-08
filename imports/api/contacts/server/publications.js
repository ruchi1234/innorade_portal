import { Meteor } from 'meteor/meteor';
import Contacts from '/imports/modules/contacts/collection';

Meteor.publish('contacts', function () {
  return Contacts.find({ userId: this.userId });
});
