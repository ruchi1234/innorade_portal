import { Meteor } from 'meteor/meteor';
import { _ } from 'meteor/underscore';
import { SimpleSchema } from 'meteor/aldeed:simple-schema';
import { check } from 'meteor/check';
const { defaultImage: DEFAULT_IMAGE } = Meteor.settings.public.users;

const Users = Meteor.users;
import '/imports/startup/mongo_collection_extensions';
import attachImagesBehavior from '/imports/modules/collection_behaviors/images';
import attachFavoritableBehavior from '/imports/modules/collection_behaviors/favoritable';

/*
 ** file: both.users_models.jsx
 ** by: MavenX - tewksbum Feb 2016
 ** re: User schema, collection creation and helpers
 **/
Meteor.users.alias = 'users';

attachFavoritableBehavior(Users);

const { DenormCountField } = Mavenx.schemas;

SimpleSchema.debug = true;

const ProfileSchema = new SimpleSchema({
  // brief bio supplied by user
  bio: {
    type: String,
    optional: true,
  },
  firstName: {
    type: String,
    // regEx: /^[a-zA-Z]+$/,
    optional: true, //,
    // denyUpdate: true,
    // autoValue: function () {
    //     if ((this.isInsert || this.isUpsert) && this.siblingField('name').value) {
    //         return s.titleize(this.siblingField('name').value.trim().replace(/[ ]+/g," ").split(" ")[0]);
    //     } else {
    //         this.unset();
    //     }
    // }
  },
  leadSource: {
    type: String,
    optional: true,
  },
  lastName: {
    type: String,
    // regEx: /^[a-zA-Z]+$/,
    optional: true, //,
    // denyUpdate: true,
    // autoValue: function () {
    //     if ((this.isInsert || this.isUpsert) && this.siblingField('name').value) {
    // var nameLength = this.siblingField('name').value.trim().replace(/[ ]+/g," ").split(" ");
    //         return s.titleize(nameLength[nameLength.length-1]);
    //     } else {
    //         this.unset();
    //     }
    // }
  },
  createdIp: { // ip-address where account was created from
    type: String,
    optional: true,
  },
  location: {  // telize download of location data
    type: Object,
    blackbox: true,
    optional: true,
  },
  mxpdid: {
    type: String,
    optional: true,
  },
  name: {
    type: String,
    optional: true,
  },
  referralSource: {
    type: String,
    optional: true,
  },
  /*
   * Denormalizations
   */
  clipsFavoritesCount: DenormCountField,
  /*
   * Social info
   * Follower/friend count and data to generate url
   */
  facebookId: {
    type: String,
    optional: true,
  },
  facebookFriends: {
    type: Number,
    optional: true,
  },
  twitterScreenName: {
    type: String,
    optional: true,
  },
  twitterFollowers: {
    type: Number,
    optional: true,
  },
  twitterFriends: {
    type: Number,
    optional: true,
  },
  pinterestFollowers: {
    type: Number,
    optional: true,
  },
  pinterestUrl: {
    type: String,
    optional: true,
  },
  instagramFollowers: {
    type: Number,
    optional: true,
  },
  instagramUsername: {
    type: String,
    optional: true,
  },

  /*
   * Sharing url's for non social accounts
   */
  blogUrl: {
    type: String,
    optional: true,
  },

  retailerUrl: {
    type: String,
    optional: true,
  },
});

const Schema = new SimpleSchema({
  createdAt: {
    type: Date,
  },
  username: {
    type: String,
    optional: true,
    // regEx: Mavenx.schemas.RegEx.UserName,
  },
  slug: {
    type: String,
    optional: true,
    // regEx: Mavenx.schemas.RegEx.UserName,
  },
  emails: {
    type: [Object],
    // this must be optional if you also use other login services like facebook,
    // but if you use only accounts-password, then it can be required
    optional: true,
  },
  "emails.$.address": {
    type: String,
    regEx: SimpleSchema.RegEx.Email,
    optional: false,
  },
  "emails.$.verified": {
    type: Boolean,
    autoValue: function () {
      if (this.isInsert && !this.isSet) {
        return false;
      }
      return this.value;
    },
  },
  mxpdid: {
    type: String,
    optional: true,
  },
  // notifications: {
  //       type: [Object],
  //       optional: true,
  //       autoValue: function () {
  //           if ((this.isInsert || this.isUpsert) && !this.IsSet) {
  //               return [{ type: 'email', receive: true }, { type: 'in-app', receive: true, lastRead: new Date }]
  //           } else {
  //               this.value;
  //           }
  //       }
  //   },
  //   "notifications.$.type": {
  //       type: String,
  //       optional: false,
  //       allowedValues: ['email','phone','in-app']
  //   },
  //   "notifications.$.receive": {
  //       type: Boolean,
  //       optional: false
  //   },
  //   "notifications.$.lastRead": {
  //       type: Date,
  //       optional: true
  // },
  // TODO: this will get replaced with object array like above, but to start
  // just a universal flag.
  notificationFlag: {
    type: Boolean,
    optional: true,
  },
  phones: {
    type: [Object],
    optional: true,
    autoValue: function () {
      if (this.isInsert && !this.isSet) {
        return [];
      }
    },
  },
  "phones.$.number": {
    type: String,
  },
  "phones.$.verified": {
    type: Boolean,
  },
  profile: {
    type: ProfileSchema,
    optional: true,
  },
  services: {
    type: Object,
    optional: true,
    blackbox: true,
  },
  // status: 0 for open, 1 closed / private, 3 logical delete, 4 orphaned
  status: {
    type: Number,
    optional: true,
  },
  // //TODO: review use of status
  // status: {
  // 	/* object fields: { online (logged in x min of activity) , lastLogin, idle (logged in and NOT x activity), lastActivity}*/
  // 		type: Object,
  // 		optional: true,
  // 		blackbox: true
  // },
  // TODO: review roles
  // roles: {
  //   type: [String],
  //   optional: false,
  //   allowedValues: ["creator", "contributor", "shopper", "maven", "bot", "admin"],
  //   autoValue: function () {
  //     if (this.isInsert && !this.isSet) {
  //       return ['shopper'];
  //     }
  //   },
  // },

  verified: {
    type: Boolean,
    defaultValue: false,
  },
});

Users.attachSchema(Schema);
Users.attachBehaviour('timestampable', {
  createdAt: 'createdAt',
  createdBy: false,
  updatedAt: 'updatedAt',
  updated: 'updatedBy',
  systemId: '0',
});

attachImagesBehavior(Meteor.users, {
  subDocField: 'profile',
  defaultImage: Meteor.absoluteUrl(DEFAULT_IMAGE),
});

Users.helpers({
  denormalizedDoc() {
    const imageUrl = this.profile &&
      this.profile.images &&
      this.profile.images.length > 0 &&
      this.profile.images[0] &&
      this.profile.images[0].href;

    return {
      userId: this._id,
      username: this.username,
      slug: this.slug,
      firstName: (this.profile && this.profile.firstName),
      lastName: (this.profile && this.profile.lastName),
      fullName: this.fullName(),
      imageUrl,
      favoritedCount: this.favoritedCount,
    };
  },

  getCollection() {
    return Meteor.users;
  },

  primaryEmail() {
    if (this.emails && this.emails.length) {
      return this.emails[0].address;
    }
  },

  fullName() {
    if (this.profile) {
      const { firstName, lastName, name } = this.profile;
      if (firstName || lastName) {
        const names = [this.profile.firstName, this.profile.lastName];

        // Filter removes undefined if one of the names isn't present
        // join adds a space between them.
        return names.filter(function(n){ return !!n }).join(' ');
      }
      return name;
    }
  },

  informalName() {
    if (_.get(this, 'profile.firstName')) {
      return _.get(this, 'profile.firstName');
    }
    return this.username;
  },

  isVerified() {
    return !!(
      _.findWhere(this.emails, { verified: true }) ||
      _.findWhere(this.phones, { verified: true }) ||
      this.verified
    );
  },

  canDisconnectSocial(service) {
    // List of currently available login methods
    // omitting the one we're asking about
    const services = _.without(_.keys(this.services), service);

    // List of all possible login methods
    const loginMethods = ['facebook', 'google', 'twitter', 'password'];

    // Return true if a valid login method would remain
    // after removing the one we're asking about
    return _.intersection(services, loginMethods).length > 0;
  },
});

Users.queryHelpers = {
  byUserId(options) {
    const { userId } = options;
    check(userId, String);
    return [{ _id: userId }, {}, {}];
  },
  byId(options) {
    const { _id } = options;
    check(_id, String);
    return [{ _id }, {}, {}];
  },
  byEmails(options) {
    const { emails } = options;
    check(emails, [String]);
    return [{
      'emails.address': { $in: emails },
    }, {}, {}];
  },

  byIds(options) {
    const { _ids } = options;
    check(_ids, [String]);
    return [{
      _id: { $in: _ids },
    }, {}, {}];
  },
};

export default Users;
