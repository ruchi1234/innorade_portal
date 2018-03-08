/* eslint-env mocha */
import Boards from '/imports/modules/boards/collection';
import { expect } from 'meteor/practicalmeteor:chai';
import { Factory } from 'meteor/dburles:factory';
import { Fake } from 'meteor/anti:fake';
import { CalculateQuery as calculateQuery } from '/imports/modules/calculate_query';
import { resetDatabase } from 'meteor/xolvio:cleaner';

// Mainly the db ops are easiest on server
if (Meteor.isServer) {
  describe('Board collection', function () {
    beforeEach(function (done) {
      Boards.remove({}, done);
      Factory.define('board', Boards, {
        title: () => Fake.sentence(),
        caption: () => Fake.sentence(),
        createdAt: () => new Date(),
      });
    });

    describe('query helpers', function () {
      describe('open', function () {
        it('should return open boards', function () {
          const board = Factory.build('board', {
            status: 0,
            type: 0,
          });
          Boards.direct.insert(board, { bypassCollection2: true });

          const params = {};
          const query = calculateQuery(Boards.queryHelpers, ['open'], params);
          const boards = Boards.find(...query).fetch();
          expect(boards.length).to.equal(1);
        });

        it('should not return closed boards', function () {
          const owner = 'pxxJnsmdKhrQTX8RY';
          const board = Factory.build('board', {
            status: 1,
            type: 0,
            creatorId: owner,
            favoritedByIds: [owner],
          });
          Boards.direct.insert(board, { bypassCollection2: true });

          const params = {};
          const query = calculateQuery(Boards.queryHelpers, ['open'], params);
          const boards = Boards.find(...query).fetch();
          expect(boards.length).to.equal(0);
        });
      });
    });
  });
}
