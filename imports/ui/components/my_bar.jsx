import React from 'react';
import { composeWithTracker } from 'react-komposer';
import userData from '/imports/data/users/login_state';
import Img from '/imports/ui/components/img';

const MyBar = ({ children, user }) => (
  <div className="my-bar container">
    <div className="children">
      {children}
    </div>

    {/* login doesn't garuntee user record found */}
    {user &&
      <div className="user-info">
        <div className="name">
          {user.fullName()}
        </div>
        <Img
          src={user.getImage()}
          circle
          className="user-image"
        />
      </div>
    }
  </div>
);

MyBar.propTypes = {
  children: React.PropTypes.node.isRequired,
  user: React.PropTypes.object,
};

export default composeWithTracker(userData)(MyBar);
