/* global utu */
import React from 'react';
import { Meteor } from 'meteor/meteor';
import sendEmailModalHOC from '/imports/ui/components/share/by_email/modal';
import mixpanel from 'mixpanel-browser';

const Confirmation = () => (
  <div className="confirmation">
    <h4>Invitations Sent</h4>
    <p>
      Email invitations have been sent to the friends you selected.
    </p>
    <p>
      Thanks for sharing and shopping on maven.
    </p>
  </div>
);

const defaultNotes = 'I have found a great social shopping site where you can earn for recommending' +
  ' products to your friends and your social network. It is similar to Pinterest, but it’s focused' +
  ' on shopping. And, they pay you when products you recommend are purchased.';

const ReferAFriendModal = sendEmailModalHOC({
  Confirmation,
  handleSend(options) {
    Meteor.call('users.referAFriend', options);
    mixpanel.track('Email RAF', options);
    utu.track('Email RAF', options);
    mixpanel.people.set();
  },
  defaultNotes,
});

export default ReferAFriendModal;
