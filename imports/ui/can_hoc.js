import React, { PropTypes } from 'react';
import { composeAll, compose, composeWithTracker } from 'react-komposer';
import shallowCompare from 'react-addons-shallow-compare';

import data from '/imports/data/users/login_state';
import Loader from '/imports/ui/components/loader';
import { showLogin } from '/imports/ui/components/login/modal';

class AuthenticatedComp extends React.Component {
  componentDidMount() {
    this.handleModalShow();
  }

  shouldComponentUpdate(nextProps, nextState) {
    return shallowCompare(this, nextProps, nextState);
  }

  componentDidUpdate() {
    this.handleModalShow();
  }

  handleModalShow() {
    const { loggedIn, verified, ready, allowNonVerified } = this.props;
    if (!ready) { return; }

    if (!loggedIn) {
      showLogin();
    } else if (!verified && !allowNonVerified) {
      Bert.alert('To complete your registration you must verify your email.  ' +
        'Please check your given inbox for your verification email.', 'danger', 'fixed-top');
    }
  }

  render() {
    const { loggedIn, verified, ready, allowNonVerified, Component } = this.props;

    if (!ready) {
      return (<Loader />);
    } else if (!loggedIn) {
      return (<span></span>);
    } else if (!verified && !allowNonVerified) {
      return (<span></span>);
    }

    return <Component {...this.props} />;
  }
}

AuthenticatedComp.propTypes = {
  loggedIn: PropTypes.bool.isRequired,
  ready: PropTypes.bool.isRequired,
  verified: PropTypes.bool.isRequired,
  allowNonVerified: PropTypes.bool,
  Component: PropTypes.func.isRequired,
};

export default (Component, options) => {
  const { allowNonVerified } = Object.assign({}, {
    allowNonVerified: false,
  }, options);

  const addOptions = (props, onData) => {
    onData(null, { Component, allowNonVerified });
  };

  const AuthenticatedWData = composeAll(
    composeWithTracker(data),
    compose(addOptions)
  )(AuthenticatedComp);

  return AuthenticatedWData;
};

export { AuthenticatedComp as Component };
