import { Meteor } from 'meteor/meteor';
import ContactEmails from '/imports/modules/contact_emails/collection';

Meteor.publish('contactEmails', function () {
  return ContactEmails.find({ userId: this.userId });
});
