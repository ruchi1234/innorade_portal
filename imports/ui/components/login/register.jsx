/* global utu */
import React from 'react';
import SocialButtons from '/imports/ui/components/login/social_buttons';
import mixpanel from 'mixpanel-browser';
import { Accounts } from 'meteor/accounts-base';
import { FlowRouter } from 'meteor/kadira:flow-router';

const accountRegister = (first, last, em, pw) => {
  try {
    const user = {
      email: em,
      password: pw,
      profile: {
        firstName: first,
        lastName: last,
      },
    };
    Accounts.createUser(user, (error) => {
      if (error) {
        switch (error.reason) {
          case 'Email already exists.':
            Bert.alert('An account already exists with this email.  Maybe your Facebook account?' +
              'Or forgot your password?', 'danger', 'fixed-top', 'fa-frown-o');
            break;
          default: {
            Bert.alert('There was an error trying to create your account.  ' +
            'Please try again or contact us to resolve the problem.', 'danger',
            'fixed-top', 'fa-frown-o');
            const type = 'accountRegister';
            const message = error.reason;
            Kadira.trackError(type, message);
            console.log('\n\n', message, '\n\n');
          }
        }
      } else {
        mixpanel.track('Registration', { service: 'Email' });
        utu.track('Registration', { service: 'Email' });
        FlowRouter.go('myboards');
      }
    });
  } catch (err) {
    const type = 'accountRegister';
    const message = err.reason;
    Kadira.trackError(type, message);
    console.log('\n\n', message, '\n\n');
  }
};

class Register extends React.Component {
  constructor() {
    super();
    this.state = {
      emailError: false,
      passwordError: false,
      firstNameError: false,
      lastNameError: false,
    };

    this.validateEmail = this.validateEmail.bind(this);
    this.validateFirstName = this.validateFirstName.bind(this);
    this.validateLastName = this.validateLastName.bind(this);
    this.validatePassword = this.validatePassword.bind(this);

    this.accountRegister = this.accountRegister.bind(this);
  }

  // propTypes: {
  //   token: React.PropTypes.string,
  // },

  validEmail() {
    const regex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return regex.test(this.refs.userEmail.value);
  }

  validateEmail() {
    const validEmail = this.validEmail();
    if (!validEmail) {
      Bert.alert( 'A valid email address is required.', 'danger', 'fixed-top', 'fa-frown-o' );
    }
    this.setState({ emailError: !validEmail });
  }

  validPassword() {
    const regex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,20}$/;
    return regex.test(this.refs.userPassword.value);
  }

  validatePassword() {
    const validPw = this.validPassword();
    if (!validPw) {
      Bert.alert('Password must be between 6 and 20 characters and contain 1 numeric digit, 1 upper case letter and 1 lower case letter.', 'danger', 'fixed-top', 'fa-frown-o');
    }
    this.setState({ passwordError: !validPw });
  }

  validFirstName() {
    const regex = new RegExp("^[a-zA-Z]+(([\'\,\.\-][a-zA-Z])?[a-zA-Z]*)*$");
    let response = '';
    if (this.refs.firstName.value.length <= 0) {
      response = {
        success: false,
        message: 'First name is a required field!',
      };
    } else if (this.refs.firstName.value.length > 0 && !regex.test(this.refs.firstName.value)) {
      response = {
        success: false,
        message: 'First name may only contain alphabetic characters.',
      };
    } else {
      response = {
        success: true,
        message: '',
      };
    }
    return response;
  }

  validateFirstName() {
    const validFirstName = this.validFirstName();
    if (!validFirstName.success) {
      Bert.alert(validFirstName.message, 'danger', 'fixed-top', 'fa-frown-o');
    }
    this.setState({ firstNameError: !validFirstName });
  }

  validLastName() {
    const regex = new RegExp("^[a-zA-Z]+(([\'\,\.\-][a-zA-Z])?[a-zA-Z]*)*$");
    let response = '';
    if (this.refs.lastName.value.length <= 0) {
      response = {
        success: false,
        message: 'Last name is a required field!'
      };
    } else if (this.refs.lastName.value.length > 0 && !regex.test(this.refs.lastName.value)) {
      response = {
        success: false,
        message: 'Last name may only contain alphabetic characters.',
      };
    } else {
      response = {
        success: true,
        message: '',
      };
    }
    return response;
  }

  validateLastName() {
    const validLastName = this.validLastName();
    if (!validLastName.success) {
      Bert.alert(validLastName.message, 'danger', 'fixed-top', 'fa-frown-o');
    }
    this.setState({ lastNameError: !validLastName });
  }

  accountRegister(e) {
    e.preventDefault();

    const email = this.validEmail();
    const pw = this.validPassword();
    const fname = this.validFirstName();
    const lname = this.validLastName();

    if (email && pw && fname && lname) {
      accountRegister(
        this.refs.firstName.value,
        this.refs.lastName.value,
        this.refs.userEmail.value,
        this.refs.userPassword.value
      );
    }
  }

  render() {
    const { email } = this.props;
    const {
      emailError,
      passwordError,
      firstNameError,
      lastNameError,
    } = this.state;

    return (
      <div>
        <h3>Create an Account</h3>
        <SocialButtons page="register" />
        <hr />
        <form onSubmit={this.accountRegister}>
          <input
            ref="firstName"
            type="text"
            className={`form-control input-form-control ${firstNameError ? 'form-control-error' : ''}`}
            placeholder="First name"
            autoComplete="on"
            required
            onBlur={this.validateFirstName}
          />
          <input
            ref="lastName"
            type="text"
            className={`form-control input-form-control ${lastNameError ? 'form-control-error' : ''}`}
            placeholder="Last name"
            autoComplete="on"
            required
            onBlur={this.validateLastName}
          />
          <input
            ref="userEmail"
            type="email"
            className={`form-control input-form-control ${emailError ? 'form-control-error' : ''}`}
            placeholder="Email"
            autoComplete="on"
            required
            defaultValue={email}
            onBlur={this.validateEmail}
          />
          <input
            id="userPassword"
            ref="userPassword"
            type="password"
            className={`form-control input-form-control ${passwordError ? 'form-control-error' : ''}`}
            placeholder="Password "
            required
            onBlur={this.validatePassword}
          />
          <button className="btn btn-lg btn-register" type="submit">
            Create an Account
          </button>
        </form>
        <p>
          By creating an account at Maven Xchange, you are agreeing to our &nbsp;
          <a
            href="http://about.mavenx.com/terms-of-service/"
            target="_blank"
          >
              Terms of Service.
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
  }
}

export default Register;
