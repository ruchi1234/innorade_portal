import { Meteor } from 'meteor/meteor';
import React, { PropTypes } from 'react';
import Btn from './instaConnect.comp';

const InstaBtn = ({ user }) => {
  const connected = !!user.services.instagram;
  let handleRemove;
  let handleConnect;
  if (connected) {
    handleRemove = () => {
      Meteor.call('users.disconnectSocial', 'instagram');
    };
  } else {
    handleConnect = () => {
      Meteor.connectWith(Package['bozhao:accounts-instagram'].Instagram, (err) => {
        if (err) {
          if (err.error === "User already exists") {
            Bert.alert('Another account linked to that instagram account already exists', 'danger', 'fixed-top', 'fa-frown-o');
          } else {
            Bert.alert(err.error, 'danger', 'fixed-top', 'fa-frown-o');
            throw err;
          }
        }
      })
    };
  }

  return (<Btn
    url={`https://www.instagram.com/${user.profile.instagramUsername}`}
    followerCount={user.profile.instagramFollowers}
    connected={connected}
    handleRemove={handleRemove}
    handleConnect={handleConnect}
  />);
};

InstaBtn.propTypes = {
  user: PropTypes.object,
};

export default InstaBtn;
