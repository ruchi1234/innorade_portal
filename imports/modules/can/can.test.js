import Can from '/imports/modules/can/can';

const { expect } = chai;

const tests = [
  {
    description: 'A user can update their own board',
    action: 'update',
    type: 'board',
    userId: 'uid',
    doc: {
      creatorId: 'uid',
      status: 1,
    },
    expected: true,
  },
  {
    description: 'A user can update their own clip',
    action: 'update',
    type: 'clip',
    userId: 'uid',
    doc: {
      creatorId: 'uid',
      status: 1,
    },
    expected: true,
  },
  {
    description: 'A user can update their own product',
    action: 'update',
    type: 'clip',
    userId: 'uid',
    doc: {
      creatorId: 'uid',
      status: 1,
    },
    expected: true,
  },
  {
    description: 'A user can\'t update an open board',
    action: 'update',
    type: 'board',
    userId: 'uid',
    doc: {
      creatorId: 'not_uid',
      status: 0,
    },
    expected: false,
  },
  {
    description: 'A user can update an open product',
    action: 'update',
    type: 'product',
    userId: 'uid',
    doc: {
      creatorId: 'not_uid',
      status: 0,
    },
    expected: true,
  },
  {
    description: 'A user can\'t update an open clip',
    action: 'update',
    type: 'clip',
    userId: 'uid',
    doc: {
      creatorId: 'not_uid',
      status: 0,
    },
    expected: false,
  },
  {
    description: 'A user can not update another person\'s closed board',
    action: 'update',
    type: 'board',
    userId: 'uid',
    doc: {
      creatorId: 'not_uid',
      status: 0,
    },
    expected: false,
  },
  {
    description: 'A user can update another person\'s product (products are always public?)',
    action: 'update',
    type: 'product',
    userId: 'uid',
    doc: {
      creatorId: 'not_uid',
      status: 0,
    },
    expected: true,
  },
  {
    description: 'A user can not update another person\'s closed clip',
    action: 'update',
    type: 'clip',
    userId: 'uid',
    doc: {
      creatorId: 'not_uid',
      status: 0,
    },
    expected: false,
  },
];

describe('Can (acl)', () => {
  tests.forEach(({ description, action, doc, type, userId, expected }) => {
    it(description, () => {
      expect(Can[action][type](userId, doc)).to.equal(expected);
    });
  });
});
