import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';
import { CalculateQuery } from '/imports/modules/calculate_query';
const Users = Meteor.users;
import myUsers from '/imports/modules/users/users';

/**
 * file: server.user-controller.js
 * by: MavenX - tewksbum Feb 2016
 * re: publications, methods, and helper functions for users lib
 */

Meteor.publish('userData', function () {
  if (this.userId) {
    return Users.find({ _id: this.userId });
  } else {
    return this.ready();
  }
});

Meteor.publish('profileData', function () {
  if (this.userId) {
    const response = Users.find({ _id: this.userId });
    return response;
  }
  return this.ready();
});

Meteor.publish('pubProfileData', function (slug) {
  check(slug, String);

  const response = Users.find({ slug }, { fields: {
    username: 1,
    slug: 1,
    profile: 1,
  } });
  return response;
});

Meteor.publish('users.byId', function (_id) {
  check(_id, String);

  const params = {
    _id,
    userId: this.userId,
  };
  const query = CalculateQuery(myUsers.queryHelpers, ['byId'], params);

  return Users.find(...query);
});
