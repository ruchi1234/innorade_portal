/*import React from 'react';

import ReactTestUtils from 'react-addons-test-utils';
import { findAllWithType } from 'react-shallow-testutils';

import { chai, assert, expect } from 'meteor/practicalmeteor:chai';

if (Meteor.isClient) {
  const Loader = require('/imports/ui/components/loader');
  const { Component } = require('./can_hoc');

  describe('Can HOC', function () {
    it('should be empty when no board present', function () {
      const renderer = ReactTestUtils.createRenderer();
      const Success = () => { return <span>Success</span>; };

      const canHoc = renderer.render(<Component
        allowNonVerified
        ready
        loggedIn
        Component={Success}
      />);

      expect(findAllWithType(canHoc, Success).length).to.equal(1);
      expect(findAllWithType(canHoc, Loader).length).to.equal(0);
    });

    it('should be empty when no board present', function () {
      const renderer = ReactTestUtils.createRenderer();
      const Success = () => { return <span>Success</span>; };

      const canHoc = renderer.render(<Component
        allowNonVerified
        ready={false}
        loggedIn
        Component={Success}
      />);

      expect(findAllWithType(canHoc, Success).length).to.equal(0);
      expect(findAllWithType(canHoc, Loader).length).to.equal(1);
    });
  });
}
*/
