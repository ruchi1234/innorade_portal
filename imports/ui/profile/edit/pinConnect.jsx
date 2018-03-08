import { Meteor } from 'meteor/meteor';
import React, { PropTypes } from 'react';
import Btn from './pinConnect.comp';

const PinBtn = ({ user }) => {
  const connected = !!user.services.pinterest;
  let handleRemove;
  let handleConnect;
  if (connected) {
    handleRemove = () => {
      Meteor.call('users.disconnectSocial', 'pinterest');
    };
  } else {
    handleConnect = () => {
      Meteor.connectWith(Package["accounts-pinterest"].Pinterest, (err) => {
        if (err) {
          if (err.error === "User already exists") {
            Bert.alert('Another account linked to that pinterest account already exists', 'danger', 'fixed-top', 'fa-frown-o');
          } else {
            Bert.alert(err.error, 'danger', 'fixed-top', 'fa-frown-o');
            throw err;
          }
        }
      });
    };
  }

  return (<Btn
    url={user.profile.pinterestUrl}
    followerCount={user.profile.pinterestFollowers}
    connected={connected}
    handleRemove={handleRemove}
    handleConnect={handleConnect}
  />);
};

PinBtn.propTypes = {
  user: PropTypes.object,
};

export default PinBtn;
