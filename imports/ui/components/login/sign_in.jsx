/* global utu */
import React from 'react';
import $ from 'jquery';
import { Meteor } from 'meteor/meteor';
import { Accounts } from 'meteor/accounts-base';
import mixpanel from 'mixpanel-browser';

import SocialButtons from '/imports/ui/components/login/social_buttons';


/*
 ** file: client.security.sign_in.jsx
 ** by: MavenX - tewksbum May 2016
 ** re: .jsx content to handle sign_in
 ** reference:
 */

const resetEmail = (em) => {
  event.preventDefault();

  const ue = em.toString().trim();

  try {
    Accounts.forgotPassword({ email: ue }, (err) => {
      if (err) {
        console.log(err);
        // if(error === "403") {}
        Bert.alert('Unable to reset this email. Please re-verify you have correct address.',
          'danger', 'fixed-top', 'fa-frown-o');
      } else {
        mixpanel.track('Forgot Password');
        utu.track('Forgot Password');
        Bert.alert('An email has been sent containing password reset instructions!',
          'success', 'fixed-top');
      }
    });
  } catch (err) {
    const type = 'resetEmail';
    const message = err.message;
    Kadira.trackError(type, message);
    console.log('\n\n', message, '\n\n');
  }
};

const accountLogin = (successRedirect) => (em, pw) => {
  
  try {
    const ue = em.toString().trim();
    const up = pw;
    Meteor.loginWithPassword(ue, up, (e) => {
      if (e) {
        mixpanel.track('Login - Fail', {
          service: 'Email',
          error: e.message,
        });
        utu.track('Login - Fail', {
          service: 'Email',
          error: e.message,
        });
        Bert.alert('There was a problem logging in.  Please doublecheck your email ' +
          'and password.', 'danger', 'fixed-top', 'fa-frown-o');
        FlowRouter.go(successRedirect);
      } else {
        mixpanel.track('Login - Success', {
          service: 'Email',
        });
        utu.track('Login - Success', {
          service: 'Email',
        });
      }
    });
  } catch (err) {
    const type = 'accountLogin';
    const message = err.reason;
    Kadira.trackError(type, message);
    console.log('\n\n', message, '\n\n');
  }
};

const SignIn = React.createClass({
  propTypes: {
    message: React.PropTypes.string,
  },

  getInitialState() {
    return { forgotPassword: false };
  },

  onClickPasswordReset() {
    this.setState({ forgotPassword: true });
  },

  validEmail() {
    const regex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    if (!regex.test(this.refs.userEmail.value)) {
      Bert.alert('A valid email address is required.',
        'danger', 'fixed-top', 'fa-frown-o');
      $('#userEmail').addClass('form-control-error');
      return false;
    }
    $('#userEmail').removeClass('form-control-error');
    return true;
  },

  validateEmail() {
    const regex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    if (!this.refs.userEmail || regex.test(this.refs.userEmail.value)) {
      $('#userEmail').removeClass('form-control-error');
    }
  },

  validPassword() {
    const regex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,20}$/;
    if (!regex.test(this.refs.userPassword.value)) {
      Bert.alert('Password must be between 6 to 20 characters, contain at least one ' +
      ' numeric digit, one uppercase and one lowercase letter', 'danger', 'fixed-top',
      'fa-frown-o');
      $('#userPassword').addClass('form-control-error');
      return false;
    }
    $('#userPassword').removeClass('form-control-error');
    return true;
  },

  validatePassword() {
    const regex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,20}$/;
    if (regex.test(this.refs.userPassword.value)) {
      $('#userPassword').removeClass('form-control-error');
    }
  },

  accountLogin(successRedirect) {
    return (e) => {
      e && e.preventDefault();

      const email = this.validEmail();
      const password = this.validPassword();

      if (email) {
        if (password) {
          accountLogin(successRedirect)(
            this.refs.userEmail.value,
            this.refs.userPassword.value
          );
        }
      }
    };
  },

  resetPassword(e) {
    e.preventDefault();
    resetEmail(this.refs.resetEmail.value);
  },

  toggleMode() {
    this.setState({ forgotPassword: false });
  },
  
  render() {
   
    const { message, successRedirect } = this.props;
    const { forgotPassword } = this.state;
    return (
      <div>
        <h3>
          Login
        </h3>
        {message &&
          <p>{message}</p>
        }
        <SocialButtons page="signin" successRedirect={successRedirect}/>
        <span>
          &#45; or &#45;
        </span>
        {
          !forgotPassword ? (
            <form onSubmit={this.accountLogin(successRedirect)}>
              <input
                id="userEmail"
                ref="userEmail"
                type="email"
                className="form-control input-form-control"
                placeholder="Email"
                autoComplete="on"
                required
                onBlur={this.validateEmail}
              >
              </input>
              <input
                id="userPassword"
                ref="userPassword"
                type="password"
                className="form-control input-form-control"
                placeholder="Password"
                required onBlur={this.validatePassword}
              >
              </input>
              <button
                className="btn btn-lg btn-default btn-sign-in"
                type="submit"
              >
                Login
              </button>
            </form>
          ) : (
            <form onSubmit={this.resetPassword}>
              <input
                id="resetEmail"
                ref="resetEmail"
                type="email"
                className="form-control input-form-control"
                placeholder="Enter your email here..." autoComplete="on" required
                onBlur={this.validateEmail}
              ></input>
              <button className="btn btn-lg btn-default btn-sign-in" type="submit">
                Send password reset
              </button>
            </form>
          )
        }
        <p className="forgot-password">
          <a
            ref="forgotPassword"
            onClick={!forgotPassword && this.onClickPasswordReset || this.toggleMode}
          >
              {
                !forgotPassword && 'Forgot password?' || 'Enter a password to login.'
              }
          </a>
        </p>
        <p className="copy">
          By signing  in at Maven Xchange, you are agreeing to our &nbsp;
          <a
            target="_blank"
            href="http://about.mavenx.com/terms-of-service/"
          >
             Terms of Service
          </a>
          &nbsp;and&nbsp;
          <a
            target="_blank"
            href="http://about.mavenx.com/privacy-policy/"
          >
             Privacy Policy
          </a>.
        </p>
      </div>
    );
  },
});

export default SignIn;
