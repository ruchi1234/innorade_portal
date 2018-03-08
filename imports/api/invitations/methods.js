import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';

import Contacts from '/imports/modules/contacts/collection';
import Invitations from '/imports/modules/invitations/collection';

/*
 * This method makes the assumption that relatedType has a corresponding route
 * and a corresponding collection that follows normal convention
 */
Meteor.methods({
  'invites/accept'(token) {
    check(this.userId, String);
    check(token, String);

    const prevAccepted = Invitations.findOne({ _id: token, acceptedByUserId: this.userId });
    if (prevAccepted) {
      return _.pick(prevAccepted, 'relatedType', 'relatedId');
    }


    const invite = Invitations.findOne({ _id: token, accepted: false });

    if (!invite) {
      throw new Meteor.Error('Invitation not found');
    } else {
      invite.relatedDocUpdate({
        $addToSet: { invitedIds: this.userId },
      });
      Contacts.ensureExists({ userId: invite.invitingUserId, contactId: this.userId });
      Invitations.update({ _id: token }, { $set: { accepted: true, acceptedByUserId: this.userId } });
      return _.pick(invite, 'relatedType', 'relatedId');
    }
  },
});
