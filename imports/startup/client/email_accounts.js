import { Meteor } from 'meteor/meteor';
import { Accounts } from 'meteor/accounts-base';

Accounts.onEmailVerificationLink(function (token, done) {
  console.log('onEmailVerificationLink');
  Accounts.verifyEmail(token, function (error) {
    if (!error) {
      console.log('uid: ', Meteor.userId());
      Meteor.call('verifyUser');
    }
    done();
  });
});
