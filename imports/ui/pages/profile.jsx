import React from 'react';
import { Meteor } from 'meteor/meteor';
import { FlowRouter } from 'meteor/kadira:flow-router';
import { ReactMeteorData } from 'meteor/react-meteor-data';
// import mixpanel from 'mixpanel-browser';
import ProfileEdit from '/imports/ui/components/users/profile_edit';
import CanHOC from '/imports/ui/can_hoc';
import Loader from '/imports/ui/components/loader';
import PageMessage from '/imports/ui/components/page_message';
import Subscriptions from '/imports/data/subscriptions';

import { Kadira } from 'meteor/meteorhacks:kadira';
const Users = Meteor.users;

/*
** file: client.module.user.profile.jsx
** by: MavenX - tewksbum May 2016
** re: user profile screen container
*/

const Profile = React.createClass({
  propTypes: {
    usid: React.PropTypes.string.isRequired,
  },

  mixins: [ReactMeteorData],

  onSave(args) {
    Meteor.call('updateUserAccount', args, (e) => {
      if (e) {
        Bert.alert('There was a problem updating your profile!', 'danger',
          'fixed-top', 'fa-frown-o');
        const type = 'updateUserAccount';
        const message = e.message;
        Kadira.trackError(type, message);
        console.log('\n\n', message, '\n\n');
      }
    });
    if(args.currentpassword) {
      Accounts.changePassword(
        args.currentpassword,
        args.password,
        (response) => {
          if(response.error) {
            Bert.alert(
              'Please double check your current password!',
              'danger',
              'fixed-top',
              'fa-frown-o'
            );
            $('#currentpassword').addClass('form-control-error');
            $('#currentpassword').val('');
            $('#password').val('');
            $('#confirmpassword').val('');
          } else {
            return;
          }
        });
    }
    if (args.password && args.password !== '') {
      const data = {
        password: args.password,
      };
      console.log('args: ', args);
      Meteor.call('updateUserSecurity', data, (e, r) => {
        if (e) {
          Bert.alert(
            'There was a problem updating your password!',
            'danger',
            'fixed-top',
            'fa-frown-o'
          );
          const type = 'update password';
          const message = e.message;
          Kadira.trackError(type, message);
          console.log('\n\n', message, '\n\n');
        } else {
          console.log('r: ', r);
          // Bert.alert('Your password was successfully updated!', 'info', 'fixed-top', 'fa-info');
        }
      });
    }
  },

  getMeteorData() {
    const handle = Subscriptions.subscribe('profileData');

    if (handle.ready()) {
      const user = Users.findOne(this.props.usid);
      this.data.user = user;
      if (!this.data.user) {
        Bert.alert('The page you requested is not available.  You are being redirected to boards.' +
        ' directory.', 'warning', 'fixed-top');
        FlowRouter.go('boards');
      }
    }
    this.data.ready = handle.ready();
    return this.data;
  },

  addImage() {
      // reset all the values
  },

  profilePic() {
      // reset all the values
  },

  render() {
    return (
      <div className="module">
        <header className="detail-header">
          <div className="container">
            <div className="col-sm-9">
              <h2>My Account</h2>
            </div>
          </div>
        </header>
        <div className="container">
          <div className="row">
            <div className="col-xs-12">
              <div className="board-caption text-justify"></div>
            </div>
          </div>
          {this.data.user ?
            <ProfileEdit
              user={this.data.user}
              onSave={this.onSave}
            />
            : <PageMessage>
              {!this.data.ready ?
                <Loader /> :
                <p>
                  User not found.
                </p>
              }
            </PageMessage>
          }
        </div>
      </div>
    );
  },
});

const AuthenticatedProfile = CanHOC(Profile, { allowNonVerified: true });
export default AuthenticatedProfile;
