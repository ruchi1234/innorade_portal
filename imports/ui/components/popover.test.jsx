import React from 'react';
import ReactTestUtils from 'react-addons-test-utils';

const { expect } = chai;

if (Meteor.isClient) {
  const Popover = require('./popover').default;

  describe('Popover', function() {
    it('should show when clicked', function() {
      const popover = ReactTestUtils.renderIntoDocument(
        <Popover body={<ul><li>Option</li></ul>}>
          <ul>
            <li>
              Click me
            </li>
          </ul>
        </Popover>
      );
      ReactTestUtils.Simulate.click(popover.refs.link);
      expect(popover.state.show).to.equal(true);
    });

    it('should hide when option selected', function() {
      const popover = ReactTestUtils.renderIntoDocument(
        <Popover body={<ul><li>Option</li></ul>}>
          <ul>
            <li>
              Click me
            </li>
          </ul>
        </Popover>
      );

      // Open the popover
      ReactTestUtils.Simulate.click(popover.refs.link);

      // Close the popover
      ReactTestUtils.Simulate.click(popover.refs.bodyWrap);
      expect(popover.state.show).to.equal(false);
    });
  });
}
