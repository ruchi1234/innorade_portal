/* eslint-env mocha */

import Users from './users';
import { expect } from 'meteor/practicalmeteor:chai';

const baseUser = {
  username: 'username',
  _id: 'id',
  profile: {
    images: [{ href: 'imgUrl' }],
    firstName: 'fn',
    lastName: 'ln',
  },
};

describe('Users', () => {
  describe('denormalize user helper', () => {
    it('should return the correct image', () => {
      const expected = 'expected';
      const userObj = Object.assign({}, baseUser);
      userObj.profile = Object.assign({}, userObj.profile, { images: [{ href: expected }] });
      const u = Users._transform(userObj);
      const denormed = u.denormalizedDoc();

      expect(denormed.imageUrl).to.equal(expected);
    });
  });
});
