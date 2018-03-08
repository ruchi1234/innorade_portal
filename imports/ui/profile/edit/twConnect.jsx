import { Meteor } from 'meteor/meteor';
import React, { PropTypes } from 'react';
import Btn from './twConnect.comp';

const TwBtn = ({ user }) => {
  const connected = !!user.services.twitter;
  let handleRemove;
  let handleConnect;
  if (connected) {
    handleRemove = () => {
      Meteor.call('users.disconnectSocial', 'twitter');
    };
  } else {
    handleConnect = () => {
      Meteor.connectWith('twitter', (err) => {
        if (err) {
          if (err.error === "User already exists") {
            Bert.alert('Another account linked to that twitter account already exists', 'danger', 'fixed-top', 'fa-frown-o');
          } else {
            Bert.alert(err.error, 'danger', 'fixed-top', 'fa-frown-o');
            throw err;
          }
        }
      });
    };
  }

  return (<Btn
    url={`https://twitter.com/${user.profile.twitterScreenName}`}
    followerCount={user.profile.twitterFollowers}
    friendCount={user.profile.twitterFriends}
    connected={connected}
    handleRemove={user.canDisconnectSocial('twitter') ? handleRemove : undefined}
    handleConnect={handleConnect}
  />);
};

TwBtn.propTypes = {
  user: PropTypes.object,
};

export default TwBtn;
