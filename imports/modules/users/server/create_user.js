/**
 * file: server.create_User
 * by: MavenX - tewksbum Feb 2016
 * re: all the steps taken after Meteor account is created to enrich it.
 */
import { Meteor } from 'meteor/meteor';
import { Accounts } from 'meteor/accounts-base';
import updateUserCounts from './social_data.js';
import { _ } from 'meteor/underscore';

const Users = Meteor.users;

function removeSpecialChars(str) {
  return str.replace(/(?!\w|\s)./g, '')
    .replace(/\s+/g, '')
    .replace(/^(\s*)([\W\w]*)(\b\s*$)/g, '$2');
};

/*
 * Handle account creation and data denormalization
 * for account fields
 */
Accounts.onCreateUser((options, user) => {
  console.log('\n...onCreateUser...\n');

  const profile = _.extend(_.pick(options.profile, 'firstName', 'lastName'));

  user.notificationFlag = true;
  user.profile = profile;
  user.status = 0;

  if (!user.emails) {
    user.emails = [];
  }

  // -----------------------------------------------------------------------------------------//
  // facebook SSO
  // -----------------------------------------------------------------------------------------//

  if (user.services.facebook) {
    /*
       /Retrieve fb user properties
       */
    if (!user.profile.name) {
      user.profile.name = user.services.facebook.name;
      user.profile.firstName = user.services.facebook.first_name;

      const name = user.services.facebook.name;
      const names = name.split(' ');
      let lastName;
      if (names.length > 1) {
        lastName = names[names.length - 1];
      }
      user.profile.lastName = lastName;
    }
    user.username = user.services.facebook.name.toLowerCase().replace(/ /g, "");
    while (Meteor.users.find({ username: user.username }).count() > 0) {
      user.username = user.services.facebook.name.toLowerCase().replace(/ /g, "") + Math.floor((Math.random() * 100) + 1)
    }

    //50 width, else type=large - 200 width
    user.profile.images = [{ href: 'https://graph.facebook.com/' + user.services.facebook.id + '/picture' }];

    if (Meteor.users.find({ 'emails.address': user.services.facebook.email }).count() > 0) {
      throw new Meteor.Error(403, 'Email from your facebook account is already registered.');
    } else {
      user.emails[user.emails.length] = {
        address: user.services.facebook.email,
        verified: true,
      };
    }
  }

  // -----------------------------------------------------------------------------------------//
  // google SSO
  // https://developers.google.com/identity/sign-in/web/reference#googleusergetbasicprofile
  // https://developers.google.com/identity/sign-in/web/people
  // -----------------------------------------------------------------------------------------//

  if (user.services.google) {
    // package actually takes care of this...
    // var gprofile = auth2.currentUser.get().getBasicProfile();

    if (!user.profile.name) {
      user.profile.name = user.services.google.name;
      user.profile.firstName = user.services.google.given_name;
      user.profile.lastName = user.services.google.family_name;
    }
    user.username = user.services.google.family_name;
    while (Meteor.users.find({ username: user.username }).count() > 0) {
      user.username = user.services.google.family_name.toLowerCase().replace(/ /g, "") + Math.floor((Math.random() * 100) + 1)
    }

    // 50 width, else type=large - 200 width
    user.profile.images = [{ href: user.services.google.picture }];

    if (Meteor.users.find({ 'emails.address': user.services.google.email }).count() > 0) {
      throw new Meteor.Error(403, 'Email from your google account is already registered.');
    } else {
      user.emails[user.emails.length] = {
        address: user.services.google.email,
        verified: true,
      }
    }
  }

  // -----------------------------------------------------------------------------------------//
  // Twitter
  // this is turned off for now.
  // -----------------------------------------------------------------------------------------//

  if (user.services.twitter) {
    /* TODO bio/tagline. if twitter, update profile.tagline with user description at twitter
    // Resource as to how to access twitter user for addition info
    //https://github.com/gadicc/meteor-usermap/blob/master/server/accounts.js
    */
    if (!user.profile.name){
      user.profile.name = user.services.twitter.screenName;
    }
    user.username = user.services.twitter.screenName.toLowerCase().replace(/ /g,"");
    while (Meteor.users.find({"username": user.username}).count() > 0) {
      user.username = user.services.twitter.screenName.toLowerCase().replace(/ /g, "") + Math.floor((Math.random() * 100) + 1);
    }
    user.profile.images = [{ href: user.services.twitter.profile_image_url_https }];

    user.verified = true;
  }

  // -----------------------------------------------------------------------------------------//
  // Accounts
  // default Meteor package
  // -----------------------------------------------------------------------------------------//

  if (!user.username) {
    console.log('!username...');
    if (!user.emails) {
      console.log('!email... going w/ phantom');
      user.username = 'phantom' + Math.floor((Math.random() * 100) + 1)
    } else {
      console.log('\n\n creating a username from email...');
      let _em = user.emails[0].address;
      _em = (_em.split('@', 1)).toString();
      console.log(_em);
      user.username = _em + Math.floor((Math.random() * 100) + 1);
      console.log(user.username);
    }
  }

  user.slug = removeSpecialChars(user.username);
  console.log('\n', user, '\n');
  return user;

});


/**
 * hijack updateOrCreateUserFromExternalService to merge a verifed existing account
 * with a new account.
 * @param {string} serviceName - auth service.
 * @param {object} serviceData - data from service.
 * @param {object} options - other options.
 */
orig_updateOrCreateUserFromExternalService = Accounts.updateOrCreateUserFromExternalService;
Accounts.updateOrCreateUserFromExternalService = function(serviceName, serviceData, options) {
  var loggedInUser = Meteor.user();
  if(loggedInUser) {
    if(typeof(loggedInUser.services[serviceName]) === "undefined"){
      var setAttr = {};
      setAttr["services." + serviceName] = serviceData;
      Meteor.users.update(loggedInUser._id, {$set: setAttr});
    }
  } else if (serviceData.email) {
    // update user service data record
    const updateUser = (uid) => {
      const toSet = {};
      toSet[`services.${serviceName}`] = serviceData;
      Meteor.users.update(uid, { $set: toSet });
    };

    // check for exact user match (service already associated)
    const q = {};
    q[`services.${serviceName}.email`] = serviceData.email;
    const exactUser = Users.findOne(q);
    if (exactUser) {
      updateUser(exactUser._id);
    } else {
      // Check for user with same email
      const existingUser = Accounts.findUserByEmail(serviceData.email);
      if (existingUser && existingUser.emails[0].verified) {
        updateUser(existingUser._id);
      }

      if (existingUser && !existingUser.emails[0].verified) {
        console.log("\n\n\n");
        console.log("oAuth login w/ non verified email");
        console.log("Deleted user: "  + existingUser._id);
        Meteor.users.remove({ _id: existingUser._id });
        console.log("\n\n\n");
      }
    }
  }
  return orig_updateOrCreateUserFromExternalService.apply(this, arguments);
};



/*
 * Get user follower counts
 */

const updateSocialData = (user) => {
  _.forEach(user.services, (service, key) => {
    if (updateUserCounts[key]) {
      updateUserCounts[key](
        user._id,
        key,
        service
      );
    }
  });
};

Accounts.onLogin((r) => {
  if (r.allowed && r.user) {
    updateSocialData(r.user.services);
  }
});

Meteor.users.after.update((props,opts,etc) => {
  if (_.contains(etc, 'services')) {
    updateSocialData(opts);
  }
});
