import React from 'react';
import { Meteor } from 'meteor/meteor';
import { FlowRouter } from 'meteor/kadira:flow-router';
import Loader from '/imports/ui/components/loader';
import canHOC from '/imports/ui/can_hoc';

const AcceptInvite = new React.createClass({
  displayName: 'acceptInvite',

  propTypes: {
    token: React.PropTypes.string.isRequired,

    // product is actually boardProduct
    type: React.PropTypes.oneOf(['board', 'product']),
  },

  getInitialState() {
    return {
      error: false,
    };
  },

  componentWillMount() {
    const { token } = this.props;
    Meteor.call('invites/accept', token, (err, resp) => {
      if (err) {
        Bert.alert('The content you are accessing is private', 'danger', 'fixed-top');
        FlowRouter.go('boards');
      } else {
        const { relatedType, relatedId } = resp;
        FlowRouter.go(relatedType, { _id: relatedId });
      }
    });
  },

  render() {
    return (
      <Loader />
    );
  },
});

const AuthenticatedAcceptInvite = canHOC(AcceptInvite, {
  allowNonVerified: true,
});

export default AuthenticatedAcceptInvite;
