/* global utu */
import React from 'react';
import { Meteor } from 'meteor/meteor';
import { FlowRouter } from 'meteor/kadira:flow-router';
import { Accounts } from 'meteor/accounts-base';
import mixpanel from 'mixpanel-browser';

import UserLedgersBalance from '/imports/modules/user_ledgers/user_ledgers_balance';
import { showLogin } from '/imports/ui/components/login/modal';

/*
** file: client.component.navbar
** by: MavenX - tewksbum Feb 2016
**              tewksbum Jun 2016
** re: User header bar.  Handles login state and displaying current commission
**  balance.
** reference:
** https://www.event`edmind.com/items/meteor-customizing-login
*/

class LoginState {
  static get() {
    if (Meteor.user()) {
      return LoginState.LOGGED_IN;
    } else if (Meteor.loggingIn()) {
      return LoginState.LOGGING_IN;
    } else if (!Accounts.loginServicesConfigured()) {
      return this.WAITING_CONFIG;
    } else {
      return this.LOGGED_OUT;
    }
  }
}

LoginState.LOGGED_IN = 'loggedIn';
LoginState.LOGGED_OUT = 'loggedOut';
LoginState.LOGGING_IN = 'loggingIn';
LoginState.WAITING_CONFIG = 'waitingConfig';

const UserBar = React.createClass({
  mixins: [ReactMeteorData],

  onClickLedger() {
    if (Meteor.user()) {
      FlowRouter.go('myuserledger');
    } else {
      Bert.alert('Login to see your balance, or signup to start earning with MavenX!',
        'info', 'fixed-top', 'fa-info');
    }
  },

  onClickLogin(e) {
    e.preventDefault();
    mixpanel.track('Login - Start'); // FIXME - why does this fire twice?
    utu.track('Login - Start'); // FIXME - why does this fire twice?
    console.log('showLogin');
    showLogin({ successRedirect: '/myboards' });
  },

  getMeteorData() {
    const handle = Meteor.subscribe('UserLedgersBalanceById');

    if (handle.ready()) {
      this.data.ledgerBalance = UserLedgersBalance.findOne(
        { userId: Meteor.userId() });
    }
    return {
      loginState: LoginState.get(),
    };
  },

  renderLogin() {
    switch (this.data.loginState) {
    case (LoginState.LOGGED_OUT):
      return (
        <span className="dropdown">
          <a href="#" onClick={this.onClickLogin}>
            Login
          </a>
        </span>
      );
    case (LoginState.LOGGING_IN):
      return (
        <span className="dropdown">
          <a href="#">
            Logging In...
          </a>
        </span>
      );
    case (LoginState.LOGGED_IN):
      // TODO: logic for Welcome back
      // <b>Welcome back,</b>
      return (
        <span className="dropdown">
          <a data-toggle="dropdown" className="navbar-link dropdown dropdown-toggle" href="#">
            {Meteor.user().username}
            <span className="carat"></span>
          </a>
          <ul role="menu" className="dropdown-menu">
            <li>
              <a href={FlowRouter.path('profile', { slug: Meteor.user() && Meteor.user().slug })}>
                Profile
              </a>
            </li>
            <li>
              <a href={FlowRouter.path('myuserledger')} >
                Dashboard
              </a>
            </li>
            <li><a href={FlowRouter.path('getmavelet')} >Get Mavelet</a></li>
            <li>
              <a href={FlowRouter.path('referAFriend')} >
                Refer a friend
              </a>
            </li>
            <li role="separator" className="divider"></li>
            <li>
              <a
                onClick={() => {
                  mixpanel.track('Logout');
                  utu.track('Logout');
                  Accounts.logout();
                }}
              >Logout</a>
            </li>
          </ul>
        </span>
      );
    default:
      return null;
    }
  },

  render() {
    const _lb = this.data && this.data.ledgerBalance && this.data.ledgerBalance.sum || 0;
    const lb = `$ ${parseFloat(Math.round(_lb * 100) / 100).toFixed(2)}`;
    return (
      <div className="nav top-bar">
        <div className="container">
          <div className="navbar-text">
            {this.renderLogin()}
            <span className="controls">
              <span className="dropdown">
                <a href="" className="navbar-link" onClick={this.onClickLedger}>
                  {lb}
                  <div className="right-carat"></div>
                </a>
              </span>
            </span>
          </div>
        </div>
      </div>
    );
  },
});

export default UserBar;
