/* eslint-env mocha */


import { Meteor } from 'meteor/meteor';
import React from 'react';
import ReactTestUtils from 'react-addons-test-utils';
import { expect } from 'meteor/practicalmeteor:chai';


if (Meteor.isClient) {
  const Component = require('./email_input').default;
  describe('Share by email - email input', () => {
    beforeEach(function () {
      this.addEmailCalls = [];
      const addEmail = (...props) => {
        this.addEmailCalls.push(props);
      };

      this.rendered = ReactTestUtils.renderIntoDocument(<Component addEmail={addEmail} />);
    });

    it('should call add email if valid email entered and submitted', function () {
      const node = this.rendered.refs.input;
      node.value = 'valid@email.com';
      ReactTestUtils.Simulate.change(node);
      ReactTestUtils.Simulate.keyDown(node, { key: 'Enter', keyCode: 13, which: 13 });
      expect(this.addEmailCalls.length).to.equal(0);
    });

    it('should not call add email if invalid email entered and submitted', function () {
      const node = this.rendered.refs.input;
      node.value = 'invalid';
      ReactTestUtils.Simulate.change(node);
      ReactTestUtils.Simulate.keyDown(node, { key: 'Enter', keyCode: 13, which: 13 });
      expect(this.addEmailCalls.length).to.equal(0);
    });

    it('reset should clear input', function () {
      const node = this.rendered.refs.input;
      node.value = 'giraffe';
      ReactTestUtils.Simulate.change(node);
      this.rendered.reset();
      expect(node.value).to.equal('');
    });
  });
}
