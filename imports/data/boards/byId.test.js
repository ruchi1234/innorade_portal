import { Meteor } from 'meteor/meteor';
import data from './byId';
import Subscriptions from '/imports/data/subscriptions';
import Boards from '/imports/modules/boards/collection';

const { expect } = chai;

const returnedBoard = { _id: 'Board' };

if (Meteor.isClient) {
  describe('Board data byId', () => {
    beforeEach(function() {
      this._oldSub = Subscriptions.subscribe;
      Subscriptions.subscribe = (...props) => {
        this._subCall = props;
        return { stop: () => {}, ready: () => true };
      };

      this._oldFindOne = Boards.findOne;
      Boards.findOne = (...props) => {
        this._findCall = props;
        return returnedBoard;
      };
    });

    afterEach(() => {
      Subscriptions.subscribe = this._oldSub;
      this._subCall = undefined;
      Boards.findOne = this._oldFind;
      this._findCall = undefined;
    });

    it('no boardId provided', () => {
      const onData = (e, newProps) => {
        expect(newProps).to.deep.equal({});
      };

      data({}, onData);
    });

    it('subscribes and returns board', () => {
      const expectedBID = 'thosauth';
      const onData = (e, newProps) => {
        expect(newProps).to.deep.equal({ board: returnedBoard, ready: true });
      };

      data({ boardId: expectedBID }, onData);
    });
  });
}
