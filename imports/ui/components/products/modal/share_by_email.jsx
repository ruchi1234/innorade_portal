/* global utu */
import React from 'react';
import { Meteor } from 'meteor/meteor';
import sendEmailModalHOC from '/imports/ui/components/share/by_email/modal';
import mixpanel from 'mixpanel-browser';

const Confirmation = () => (
  <div className="confirmation">
    <h4>
      An email about the product you selected has been sent.
    </h4>
    <h4>
      Thanks for sharing shopping ideas on Maven!
    </h4>
  </div>
);

const defaultNotes = 'I saw a product at Maven and thought you might be interested.';

const ShareModal = sendEmailModalHOC({
  Confirmation,
  handleSend(options, props) {
    const opts = Object.assign(options, {
      relatedType: 'product',
      relatedId: props.productId,
    });
    Meteor.call('boardProducts.invite', opts);
    mixpanel.track('Email Clip', opts);
    utu.track('Email Clip', opts);
    mixpanel.people.set();
  },
  defaultNotes,
});

export default ShareModal;
