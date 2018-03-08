/* global utu */
import React from 'react';
import { Meteor } from 'meteor/meteor';
import { FlowRouter } from 'meteor/kadira:flow-router';
import { Session } from 'meteor/session';
import mixpanel from 'mixpanel-browser';
import Col from '/imports/ui/components/grid/col';

/*
** file: client.components.security.social_buttons
** by: MavenX - tewksbum Mar 2016
**              tewksbum Jun 2016
** re: buttons to initiate social oAuth login.
** ref:
// https://github.com/meteor/meteor/commit/44a4604c8d9a0065f8614f8e11ddb04918132cc1
*/
// Fucking shit-tastic hack to get around redirect oAuth login in facebook
// having an error
const sesVarRedir = 'fb-login-redirect';
Meteor.startup(() => {
  if (Session.get(sesVarRedir)) {
    FlowRouter.go(Session.get(sesVarRedir));
    Session.set(sesVarRedir, undefined);
  }
});

const SocialButtons = React.createClass({
  socialLogin(event) {
    const { successRedirect } = this.props;
    event.preventDefault();

    const reglog = mixpanel.get_property('usid') ? 'Login' : 'Registration';

    switch (event.target.getAttribute('data-social-login')) {
    case 'loginWithFacebook':
      // Session.set('oAuthFBLogin', true);
      // TODO: this is suboptimal in that the login may have failed... and
      // we can't delineate between a FB registration
      mixpanel.track(reglog, { service: 'Facebook' });
      utu.track(reglog, { service: 'Facebook' });
      console.log('setting session');
      Session.set(sesVarRedir, successRedirect);
      Meteor.loginWithFacebook({ requestPermissions: ['email','user_friends'] }, () => {
        // NOTE: this is never reached w/ FB....
      });
      break;
    case 'loginWithTwitter':
      Meteor.loginWithTwitter((e) => {
        if (e) {
          mixpanel.track('Login - Fail', {
            service: 'Twitter',
            error: e.message,
          });
          utu.track('Login - Fail', {
            service: 'Twitter',
            error: e.message,
          });
          console.log(e.message, 'twitter login failed');
        } else {
          mixpanel.track(reglog, { service: 'Twitter' });
          utu.track(reglog, { service: 'Twitter' });
          FlowRouter.go('/myboards');
        }
      });
      break;
    case 'loginWithGoogle':
    
      Meteor.loginWithGoogle({ requestPermissions: ['email'] }, (e) => {
        if (e) {
          mixpanel.track('Login - Fail', {
            service: 'Google',
            error: e.message,
          });
          utu.track('Login - Fail', {
            service: 'Google',
            error: e.message,
          });
          console.log(e.message, 'google login failed');
        } else {
          mixpanel.track(reglog, { service: 'Google' });
          utu.track(reglog, { service: 'Google' });
          FlowRouter.go(successRedirect);
        }
      });
      break;
      default:
    }
  },

  render() {
    return (
      <div className="row">
        <Col
          xs={12}
          md={12}
          lg={12}
          className="social-button-container"
          data-social-login="loginWithFacebook"
        >
          <a
            href="#"
            onClick={this.socialLogin}
            className="facebook-login"
            data-social-login="loginWithFacebook"
          >
            <i className="fa fa-facebook" aria-hidden="true"></i>
            <span>Sign in with <strong>Facebook</strong></span>
          </a>
        </Col>
        <Col
          xs={12}
          md={12}
          lg={12}
          className="social-button-container"
          data-social-login="loginWithTwitter"
        >
          <a
            href="#"
            className="twitter-login"
            onClick={this.socialLogin}
            data-social-login="loginWithTwitter"
          >
            <i className="fa fa-twitter" aria-hidden="true"></i>
            <span>Sign in with <strong>Twitter</strong></span>
          </a>
        </Col>
        <Col
          xs={12}
          md={12}
          lg={12}
          className="social-button-container"
          data-social-login="loginWithGoogle"
        >
          <a
            href="#"
            onClick={this.socialLogin}
            className="google-login"
            data-social-login="loginWithGoogle"
          >
            <i className="fa fa-google-plus" aria-hidden="true"></i>
            <span>Sign in with <strong>Google</strong></span>
          </a>
        </Col>
      </div>
    );
  },
});

export default SocialButtons;
