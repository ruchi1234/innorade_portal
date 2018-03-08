/* eslint-env node, mocha */

import { Meteor } from 'meteor/meteor';
import { Tracker } from 'meteor/tracker';
import { ReactiveVar } from 'meteor/reactive-var';
import EventHorizon from 'meteor/patrickml:event-horizon';
import ReactTestUtils from 'react-addons-test-utils';
import React from 'react';
import ReactDOM from 'react-dom';

const { expect } = chai;
if (Meteor.isClient) {
  const { showLogin, showRegister, autoCloseOnLogin, Login } = require('./modal');
  const { closeModal } = require('/imports/data/modal');

  describe('Login modal', () => {
    beforeEach(function () {
      this.oldUserId = Meteor.userId;
      const uid = new ReactiveVar();
      Meteor.userId = () => uid.get();
      this.setUserId = (id) => uid.set(id);
    });

    afterEach(function () {
      Meteor.userId = this.oldUserId;
    });

    it('closes after login', function () {
      showLogin();
      this.setUserId('testUserId');
      autoCloseOnLogin();

      const mState = EventHorizon.subscribe('modal');
      expect(mState.open).to.equal(false);
    });

    it('opens modal when called', () => {
      showLogin();

      Tracker.flush();

      const mState = EventHorizon.subscribe('modal');
      expect(mState.open).to.equal(true);
    });

    it('opens register when requested', () => {
      showRegister();

      Tracker.flush();

      const state = EventHorizon.subscribe('login');
      const mState = EventHorizon.subscribe('modal');
      expect(mState.open).to.equal(true);
      expect(state.register).to.equal(true);
    });

    it('toggles to register from login when correct button pressed', () => {
      const comp = ReactTestUtils.renderIntoDocument(
        <Login register={false} email="" message="" />
      );

      const button = ReactTestUtils.findRenderedDOMComponentWithClass(comp, 'login-mode-toggle');
      ReactTestUtils.Simulate.click(button);

      const state = EventHorizon.subscribe('login');
      expect(state.register).to.equal(true);
    });

    it('toggles to login from register when correct button pressed', () => {
      showRegister();
      const comp = ReactTestUtils.renderIntoDocument(
        <Login register email="" message="" />
      );

      const button = ReactTestUtils.findRenderedDOMComponentWithClass(comp, 'login-mode-toggle');
      ReactTestUtils.Simulate.click(button);

      const state = EventHorizon.subscribe('login');
      expect(state.register).to.equal(false);
    });

    it('resets state to show login on close', () => {
      showRegister();
      Tracker.flush();

      // No concept of unmount in test utils for some reason
      const container = document.createElement('div');
      ReactDOM.render(<Login />, container);
      ReactDOM.unmountComponentAtNode(container);

      const state = EventHorizon.subscribe('login');
      expect(state.register).to.equal(false);
    });
  });
}
