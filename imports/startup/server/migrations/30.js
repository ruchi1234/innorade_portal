import { Migrations } from 'meteor/percolate:migrations';
import { Meteor } from 'meteor/meteor';


Migrations.add({
  version: 30,
  name: 'Fix first and last names',
  up() {
    /*
    Meteor.users.find().forEach((u) => {
      if (!u.profile || (!u.profile.firstName && !u.profile.lastName)) {
        if (u.services && u.services.facebook) {
          const name = u.services.facebook.name;
          const names = name.split(' ');

          const firstName = u.services.facebook.first_name;
          let lastName;
          if (names.length > 1) {
            lastName = names[names.length - 1];
          }
          Meteor.users.update({
            _id: u._id,
          }, {
            $set: {
              'profile.firstName': firstName,
              'profile.lastName': lastName,
            },
          });
        } else if (u.services.google) {
          Meteor.users.update({
            _id: u._id,
          }, {
            $set: {
              'profile.firstName': u.services.google.given_name,
              'profile.lastName': u.services.google.family_name,
            },
          });
        }
      }
    });
    */
  },
});
