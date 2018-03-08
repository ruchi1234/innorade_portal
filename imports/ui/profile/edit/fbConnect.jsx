import { Meteor } from 'meteor/meteor';
import { FlowRouter } from 'meteor/kadira:flow-router';
import { Session } from 'meteor/session';
import { Tracker } from 'meteor/tracker';
import { _ } from 'meteor/underscore';
import React, { PropTypes } from 'react';
import Btn from './fbConnect.comp';

// Fucking shit-tastic hack to get around redirect oAuth login in facebook
// having an error
const sesVar = 'fb-connect-sourced';
const tracker = Tracker.autorun(() => {
  if (Session.get(sesVar)) {
    Meteor.subscribe('userData', () => {
      if (!_.get(Meteor.user(), 'services.facebook')) {
        Bert.alert(
          'Another account linked to that facebook account already exists',
          'danger',
          'fixed-top',
          'fa-frown-o'
        );
      }
      Session.set(sesVar, undefined);
    });
  }
});

const FbBtn = ({ user }) => {
  const connected = !!user.services.facebook;
  let handleRemove;
  let handleConnect;
  if (connected) {
    handleRemove = () => {
      Meteor.call('users.disconnectSocial', 'facebook');
    };
  } else {
    handleConnect = () => {
      tracker.stop();
      Session.set(sesVar, true);
      Meteor.connectWith('facebook', { requestPermissions: ['email','user_friends'] });
    };
  }

  return (<Btn
    url={`https://www.facebook.com/${user.profile.facebookId}`}
    friendCount={user.profile.facebookFriends}
    connected={connected}
    handleRemove={user.canDisconnectSocial('facebook') ? handleRemove : undefined}
    handleConnect={handleConnect}
  />);
};

FbBtn.propTypes = {
  user: PropTypes.object,
};

export default FbBtn;
