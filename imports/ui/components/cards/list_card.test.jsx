import React from 'react';
import { Meteor } from 'meteor/meteor';
import ReactTestUtils from 'react-addons-test-utils';

const { expect } = chai;

if (Meteor.isClient) {
  const ListCard = require('./list_card').default;

  describe('List Card', function() {
    it('on click fires', function() {
      let clicked = false;

      const listCard = ReactTestUtils.renderIntoDocument(
        <ListCard
          onClick={() => (clicked = true)}
          showCheckbox={false}
          board={{
            images: [],
            getImage() { return ''; },
            getImages() { return []; },
            boardProductImages: [],
            getCreator: () => ({ getImage: () => '' }),
          }}
        />
      );

      ReactTestUtils.Simulate.click(listCard.refs.this);
      expect(clicked).to.equal(true);
    });
  });
}
