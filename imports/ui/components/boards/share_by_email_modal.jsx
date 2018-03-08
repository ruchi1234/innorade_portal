/* global utu */
import React from 'react';
import { Meteor } from 'meteor/meteor';
import sendEmailModalHOC from '/imports/ui/components/share/by_email/modal';
import mixpanel from 'mixpanel-browser';

const Confirmation = () => (
  <div className="confirmation">
    <h4>
      An email about the board you selected has been sent.
    </h4>
    <h4>
      Thanks for sharing shopping ideas on Maven!
    </h4>
  </div>
);

const defaultNotes = 'I saw a board with a product collection at Maven and thought you might be interested in some items.';

const ShareModal = sendEmailModalHOC({
  Confirmation,
  handleSend(options, props) {
    // let notes = this;
    // console.log('notes' + this);
    const opts = Object.assign(options, {
      relatedType: 'board',
      relatedId: props.boardId,
    });
    Meteor.call('boards.invite', opts);
    mixpanel.track('Email Board', opts);
    utu.track('Email Board', opts);
    mixpanel.people.set();
  },
  defaultNotes,
});

export default ShareModal;
