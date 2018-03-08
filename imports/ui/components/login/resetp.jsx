import React from 'react';
import { Accounts } from 'meteor/accounts-base';
import $ from 'jquery';

/**
 * file: client.Login
 * by: MavenX - tewksbum Feb 2016
 * re: Reg/Login screen.  This is where all logged in sessions originate.
 * reference:
 * https://www.eventedmind.com/items/meteor-customizing-login
 */

const Resetp = React.createClass({
  propTypes: {
    token: React.PropTypes.string,
  },

  resetPassword() {
    Accounts.resetPassword(this.props.token, this.refs.userPassword.value, (err) => {
      if (err) {
        console.log('reseterr: ', err);
        if (err === 'Token expired [403]') {
          Bert.alert('Your password reset has expired.  Please request a new one and try again.',
            'danger', 'fixed-top', 'fa-frown-o');
        } else {
          Bert.alert('There was a problem resetting your password, please try again.',
            'danger', 'fixed-top', 'fa-frown-o');
        }
      } else {
        Bert.alert('Your password has been reset! Redirecting to login.', 'success', 'fixed-top');
      }
    });
    FlowRouter.go('/');
  },

  validatePassword2() {
    if (this.refs.userPassword.value !== this.refs.userConfirmPassword.value) {
      Bert.alert('Passwords do not match, please re-check and try again.',
        'danger', 'fixed-top', 'fa-frown-o');
      $('#userConfirmPassword').addClass('form-control-error');
      $('#btn-reset-email').addClass('signin-button-disable');
    } else {
      document.getElementById('userConfirmPassword').className = 'form-control';
      $('#btn-reset-email').removeClass('signin-button-disable');
    }
  },

  validatePassword() {
    const regex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,20}$/;
    if (!regex.test(this.refs.userPassword.value)) {
      Bert.alert('Password must be between 6 to 20 characters, contain at least one numeric digit, one uppercase and one lowercase letter', 'danger', 'fixed-top', 'fa-frown-o');
      $('#userPassword').addClass('form-control-error');
      $('#btn-reset-email').addClass('signin-button-disable');
    } else {
      document.getElementById('userPassword').className = 'form-control';
      $('#btn-reset-email').removeClass('signin-button-disable');
    }
  },

  render() {
    return (
      <div className="container-fluid login-backimage">
        <div className="row">
          <div className="col-sm-3"></div>
          <div className="col-sm-6 resetp-form">
            <div className="row">
              <div className="col-sm-12">
                <h1>RESET PASSWORD</h1>
              </div>
            </div>
            <div className="row">
              <div className="col-sm-12">
                <input id="userPassword" ref="userPassword" type="password"
                  className="form-control"
                  placeholder="Enter your NEW password here..."
                  required onBlur={this.validatePassword}
                ></input>
              </div>
            </div>
            <div className="row">
              <div className="col-sm-12">
                <input id="userConfirmPassword" ref="userConfirmPassword" type="password"
                  className="form-control" placeholder="Repeat your password here..."
                  required onBlur={this.validatePassword2}
                ></input>
              </div>
            </div>
            <div className="row">
              <div className="col-sm-12">
                <a className="btn btn-primary" id="btn-reset-email" data-dismiss="modal"
                  onClick={this.resetPassword}
                >Reset</a>
              </div>
            </div>
          </div>
          <div className="col-sm-3"></div>
        </div>
      </div>
    );
  },
});

export default Resetp;
