/* global utu */
import React, { PropTypes, Component } from 'react';
import EventHorizon from 'meteor/patrickml:event-horizon';
import mixpanel from 'mixpanel-browser';
import { Meteor } from 'meteor/meteor';

import Register from '/imports/ui/components/login/register';
import Col from '/imports/ui/components/grid/col';
import Row from '/imports/ui/components/grid/row';
import SignIn from '/imports/ui/components/login/sign_in';

import { FlowRouter } from 'meteor/kadira:flow-router';
import { Header, Body, Content } from '/imports/ui/components/modal';
import { Tracker } from 'meteor/tracker';
import { openModal, closeModal, modalType } from '/imports/data/modal';
import { composeWithTracker } from 'react-komposer';

/*
 * Handle the state
 */

const defaultStore = {
  register: false,
  email: '',
};

EventHorizon.createAction('login', 'OPEN_REGISTER', (store, data, update) => {
  update(Object.assign({
    register: true,
  }, data));
});

EventHorizon.createAction('login', 'OPEN_LOGIN', (store, data, update) => {
  update(Object.assign({
    register: false,
  }, data));
});

EventHorizon.createAction('login', 'RESET_LOGIN', (store, data, update) => {
  update(defaultStore);
});

const showLogin = (props) => {
  
  EventHorizon.dispatch('OPEN_LOGIN', props);
  openModal(<LoginWData {...props} />, { type: 'login' });
};

const showRegister = (props) => {
  EventHorizon.dispatch('OPEN_REGISTER', props);
  openModal(<LoginWData {...props} />, { type: 'login' });
};

const reset = () => {
  EventHorizon.dispatch('RESET_LOGIN');
};

EventHorizon.createStore('login', defaultStore);

const Base = ({ children }) => (
  <Content className="loginModal">
    <Header />
    <Body>
      <Row className="login">
        <Col xs={8} md={8} lg={8} xsOffset={2} mdOffset={2} lgOffset={2}>
          {children}
        </Col>
      </Row>
    </Body>
  </Content>
);

Base.propTypes = {
  children: PropTypes.node.isRequired,
};

const Form = ({ register, message, email, successRedirect }) => (
  
  register ?
    <Register
      email={email}
      successRedirect={successRedirect}
    /> :
    <SignIn
      message={message}
      successRedirect={successRedirect}
    />
);

Form.propTypes = {
  register: PropTypes.bool,
  message: PropTypes.string,
  email: PropTypes.string,
  successRedirect: PropTypes.string,
};

class Login extends Component {
  componentWillUnmount() {
    reset();
  }

  render() {
    const { register, message, email, successRedirect } = this.props;
   
    return (
      <Base>
        <Form
          register={register}
          message={message}
          email={email}
          successRedirect={successRedirect}
        />

        <hr />

        {register ? <span>Already have an account?</span> : <span>Need an account?</span>}
        <a
          onClick={() => {
            mixpanel.track('Sign Up Clicked');
            utu.track('Sign Up Clicked');
            if (register) { showLogin(); } else { showRegister({ email }); }
          }}
          className="btn btn-default btn-lg login-mode-toggle"
        >
          {register ? 'Login' : 'Sign up'}
        </a>
      </Base>
    );
  }
}

Login.propTypes = {
  register: PropTypes.bool,
  message: PropTypes.string,
  email: PropTypes.string,
  successRedirect: PropTypes.string,
};

const LoginWData = composeWithTracker((props, onData) => {
  onData(null, EventHorizon.subscribe('login'));
})(Login);

Tracker.autorun(() => {
  if (FlowRouter.getQueryParam('register')) {
    Meteor.defer(() => {
      showRegister();
      FlowRouter.setQueryParams({ register: undefined });
    });
  }
});

const autoCloseOnLogin = () => {
  if (Meteor.userId() && modalType() === 'login') {
    closeModal();
  }
};

Tracker.autorun(autoCloseOnLogin);

export { showLogin, showRegister, Login, autoCloseOnLogin };
