import { Meteor } from 'meteor/meteor';

/**
 * file: server.startup.js
 * by: MavenX - tewksbum Feb 2016
 * re: setsup all the final server config @ startup
 */

console.log('ROOT_URL =' + Meteor.absoluteUrl(null, { secure: false }));
process.env.MAIL_URL = Meteor.settings.services.mailgun.smtpUrl;
// NOTE: do NOT run mongo switch here.  Do from commandline.
// process.env.MONGO_URL = 'mongodb://maven:December2015@ds057745-a0.mongolab.com:57745/heroku_7vr3l7z5?3t.uriVersion=2&3t.connectionMode=direct&readPreference=primary&3t.connection.name=Staging+-+oplog'
// $ MONGO_URL=mongodb://user:password@localhost:27017/meteor meteor

// Service setup
ServiceConfiguration.configurations.remove({
  service: 'facebook',
});

ServiceConfiguration.configurations.insert({
  service: 'facebook',
  appId: Meteor.settings.services.facebook.appId,
  secret: Meteor.settings.services.facebook.secret,
  loginStyle: 'redirect',
});

// https://console.developers.google.com/home/dashboard?project=maven-connect
ServiceConfiguration.configurations.remove({
  service: 'google',
});

ServiceConfiguration.configurations.insert({
  service: 'google',
  clientId: Meteor.settings.services.google.clientId,
  secret: Meteor.settings.services.google.secret, // ,
    // loginStyle: 'redirect'
});

ServiceConfiguration.configurations.remove({
  service: 'twitter',
});

ServiceConfiguration.configurations.insert({
  service: 'twitter',
  consumerKey: Meteor.settings.services.twitter.consumerKey,
  secret: Meteor.settings.services.twitter.secret, // ,
    // loginStyle: 'redirect'
});

ServiceConfiguration.configurations.remove({
  service: 'pinterest',
});

ServiceConfiguration.configurations.insert({
  service: 'pinterest',
  scope: ['basic'],
  clientId: Meteor.settings.services.pinterest.clientId,
  secret: Meteor.settings.services.pinterest.secret, // ,
});

ServiceConfiguration.configurations.remove({
  service: 'instagram',
});

ServiceConfiguration.configurations.insert({
  service: 'instagram',
  scope: ['basic'],
  clientId: Meteor.settings.services.instagram.clientId,
  secret: Meteor.settings.services.instagram.secret, // ,
});

ServiceConfiguration.configurations.remove({
  service: 'S3',
});

ServiceConfiguration.configurations.insert({
  service: 'S3',
  key: Meteor.settings.services.aws.s3.key,
  secret: Meteor.settings.services.aws.s3.secret,
  bucket: Meteor.settings.services.aws.s3.bucket,
});

Future = Npm.require('fibers/future');
