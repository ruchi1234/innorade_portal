/* global utu */
import React from 'react';
import { Meteor } from 'meteor/meteor';
import sendEmailModalHOC from '/imports/ui/components/share/by_email/modal';
import mixpanel from 'mixpanel-browser';

const Confirmation = () => (
  <div className="confirmation">
    <h4>
      An email about the user you selected has been sent.
    </h4>
    <h4>
      Thanks for sharing shopping ideas on Maven!
    </h4>
  </div>
);

const defaultNotes = 'I saw a user profile at Maven and thought you might be interested.';

const ShareModal = sendEmailModalHOC({
  Confirmation,
  handleSend(options, props) {
    // let notes = this;
    // console.log('notes' + this);
    const opts = Object.assign(options, {
      relatedType: 'profile',
      relatedId: props.userId,
    });
    Meteor.call('profile.invite', opts);
    mixpanel.track('Email Profile', opts);
    utu.track('Email Profile', opts);
    mixpanel.people.set();
  },
  defaultNotes,
});

export default ShareModal;
