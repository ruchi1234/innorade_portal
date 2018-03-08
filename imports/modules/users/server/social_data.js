import { Meteor } from 'meteor/meteor';
import { HTTP } from 'meteor/http';
import { _ } from 'meteor/underscore';
import Twitter from 'twitter';
import Ig from 'instagram-node';

export default {
  facebook(userId, sName, serviceData) {
    Meteor.users.update({ _id: userId }, { $set: { 'profile.facebookId': serviceData.id } });

    const url = `https://graph.facebook.com/v2.8/${serviceData.id}/friends?access_token=${serviceData.accessToken}`;
    HTTP.call('GET', url, (err, r) => {
      if (err) {
        console.error("An error occcurred when fetching facebook data");
        console.error(err);
      } else {
        console.log('Raw response from facebook was', r);
        const toSet = {};
        toSet['profile.facebookFriends'] = _.get(r, 'data.summary.total_count');
        Meteor.users.update({ _id: userId }, { $set: toSet });
      }
    });
  },
  twitter(userId, sName, serviceData) {
    Meteor.users.update({ _id: userId }, {
      $set: { 'profile.twitterScreenName': serviceData.screenName },
    });

    const client = new Twitter({
      consumer_key: Meteor.settings.services.twitter.consumerKey,
      consumer_secret: Meteor.settings.services.twitter.secret,
      access_token_key: serviceData.accessToken,
      access_token_secret: serviceData.accessTokenSecret,
    });

    const params = { screen_name: serviceData.screenName };
    client.get('users/show', params, Meteor.bindEnvironment((error, u) => {
      if (!error) {
        const toSet = {};
        toSet['profile.twitterFollowers'] = _.get(u, 'followers_count');
        Meteor.users.update({ _id: userId }, { $set: toSet });
      }
    }));
  },
  pinterest(userId, sName, serviceData) {
    
    const url = `https://api.pinterest.com/v1/me/?access_token=${serviceData.accessToken}&fields=counts%2Curl%2Cusername`;
    HTTP.call('GET', url, (err, resp) => {
      if (!err) {
        Meteor.users.update({ _id: userId }, { $set: {
          'profile.pinterestFollowers': _.get(resp, 'data.data.counts.followers'),
          'profile.pinterestUrl': _.get(resp, 'data.data.url'),
        } });
      }
    });
  },
  instagram(userId, sName, serviceData) {
    Meteor.users.update({ _id: userId }, {
      $set: { 'profile.instagramUsername': serviceData.username },
    });

    const ig = Ig.instagram();
    ig.use({ access_token: serviceData.accessToken });
    ig.user(serviceData.id, Meteor.bindEnvironment((err, result) => {
      if (!err) {
        Meteor.users.update({ _id: userId }, { $set: {
          'profile.instagramFollowers': result.counts.followed_by,
        } });
      }
    }));
  },
};
