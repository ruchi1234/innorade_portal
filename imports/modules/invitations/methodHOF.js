import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';
import { Email } from 'meteor/email';

import Contacts from '/imports/modules/contacts/collection';
import ContactEmails from '/imports/modules/contact_emails/collection';
import { CalculateQuery } from '/imports/modules/calculate_query';


export default ({ renderEmail, findDoc, inviteToDoc }) =>
  function(options) {
    check(options.contactIds, [String]);
    check(options.emails, [String]);
    check(options.notes, String);
    check(options.relatedId, String);

    const { contactIds, emails, relatedId, notes } = options;

    // get board or product
    const doc = findDoc(relatedId);

    /*
     * TODO check that the user has the correct role on this doc to invite
     * users to it
     */

    if (doc) {
      /*
       * Invite Users
       */
      // Find any users that have emails in the emails array
      // so that we can add their existing user record as invited on the doc
      const usersByEmailsQ = CalculateQuery(
        Meteor.users.queryHelpers,
        ['byEmails'],
        { emails }
      );
      const emailsContactIds = [];
      Meteor.users.find(...usersByEmailsQ).forEach((u) => {
        Contacts.ensureExists({ userId: this.userId, contactId: u._id });
        emailsContactIds.push(u._id);
      });

      _.each(emails, (email) => {
        ContactEmails.ensureExists({ userId: this.userId, email });
      });

      // Add users to doc invited
      const invitedIds = _.filter([...emailsContactIds, ...contactIds], (id) => { return id && !_.contains(doc.invitedIds, id)});
      inviteToDoc(relatedId, invitedIds);

      /*
       * Send emails
       */

      // Get email addresses for all contacts passed in
      const query = CalculateQuery(
        Meteor.users.queryHelpers,
        ['byIds'],
        { _ids: contactIds }
      );
      const contactEmails = Meteor.users.find(...query).map((u) => u.primaryEmail());

      // Remove emails that didn't get found (i.e. twitter users)
      const sendToEmails = _.filter(_.uniq([...contactEmails, ...emails]), (email) => !!email);
      const fromUser = Meteor.users.findOne(this.userId);
      if (fromUser) {
        sendToEmails.forEach((email) => {
          Email.send(renderEmail({
            email,
            _id: options.relatedId,
            notes,
            fromUser,
          }));
        });
      }
    } else {
      console.log('Invitation related doc not found', JSON.stringify(options));
    }
  };
