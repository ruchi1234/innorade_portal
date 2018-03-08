/* eslint-env mocha */

import { Meteor } from 'meteor/meteor';
import React from 'react';
import ReactTestUtils from 'react-addons-test-utils';
import { isDOMComponent, findWithClass, findAll, findWithRef } from 'react-shallow-testutils';

import { Factory } from 'meteor/dburles:factory';
import { Fake } from 'meteor/anti:fake';
import { chai, assert, expect } from 'meteor/practicalmeteor:chai';

import Boards from '/imports/modules/boards/collection';

// NOTE: Before writing a method like this you'll want to double check
// that this file is only going to be loaded in test mode!!


if (Meteor.isClient) {
  const { Component: Spotlight } = require('./spotlight');
  describe('Spotlight', function () {
    beforeEach(function () {
      Factory.define('board', Boards, {
        title: () => Fake.sentence(),
        caption: () => Fake.sentence(),
        createdAt: () => new Date(),
      });
    });

    it('should be empty when no board present', function () {
      const renderer = ReactTestUtils.createRenderer();

      const spotlight = renderer.render(<Spotlight board={undefined} />);
      expect(findAll(spotlight, () => true).length).to.equal(1);
      expect(findAll(spotlight, () => true)[0].type).to.equal('span');
    });

    it('Spotlight renders when passed a board @watch', function () {
      const favoriteCount = 99;
      const clips = 5;
      let board = Factory.build('board', { favoriteCount, clips });
      board = Boards._transform(board);

      const renderer = ReactTestUtils.createRenderer();

      const spotlight = renderer.render(<Spotlight board={board} />);
      expect(isDOMComponent(spotlight)).to.equal(true);
    });
  });
}
