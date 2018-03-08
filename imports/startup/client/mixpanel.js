/* global utu */
import { Meteor } from 'meteor/meteor';
import mixpanel from 'mixpanel-browser';
import { Tracker } from 'meteor/tracker';
import { FlowRouter } from 'meteor/kadira:flow-router';
import { HTTP } from 'meteor/http';
import 'utuai-web-sdk';

/*
 * When a user isn't logged in
 *   identify (distinct id)
 */
let loggedInAliasRun = false;
const tagVisitor = () => {
  let raf = FlowRouter.getQueryParam('raf');
  let ls = FlowRouter.getQueryParam('ls');
  const mxpdid = FlowRouter.getQueryParam('mxpdid');
  const user = Meteor.user();

  const telizeEndpoint = 'https://telize-v1.p.mashape.com/ip';
  const telizeHash = Meteor.settings.public.telize.hash;

  if (Meteor.userId()) {
    if (user && user.profile) {
      utu.identity({
        name: user.profile.name, // user.name,
        email: user.emails && user.emails[0] && user.emails[0].address || null, // Meteor.user().emails[0].address,
        avatar: user.image_url,
        custom: {
          bio: user.bio,
          clipCount: user.clipCount,
          clipFavoritedCount: user.clipFavoritedCount,
          clipsFavoritesCount: user.clipsFavoritesCount,
          facebookFriends: user.facebookFriends,
          leadSource: raf || ls || 'organic',
          mxpdid: user.mxpdid,
          mavenxId: Meteor.userId(),
          username: user.username, // Meteor.user().username,
          raf: raf || mixpanel.get_property('raf'),
        },
      });
    }

    if (user && user.profile && !user.profile.mxpdid && !loggedInAliasRun) {
      loggedInAliasRun = true;
      mixpanel.alias(user._id);
      utu.alias(user._id);
      mixpanel.identify(user._id);

      if (!raf) {
        raf = mixpanel.get_property('raf');
      }
      if (!ls) {
        ls = mixpanel.get_property('leadSource');
      }
      mixpanel.track('Alias', {
        userId: Meteor.userId(),
        mxpdid: mixpanel.get_distinct_id(),
      });

      utu.track('Alias', {
        userId: Meteor.userId(),
        mxpdid: mixpanel.get_distinct_id(),
      });

      mixpanel.people.set({
        name: user.profile.name,
        $first_name: user.profile.firstName,
        $last_name: user.profile.lastName,
        $email: user.emails && user.emails[0] && user.emails[0].address || null,
        $created: (user.created || new Date()).toISOString(),
      });

      mixpanel.register({ usid: Meteor.userId() });

      Meteor.setTimeout(() => {
        HTTP.get(
          telizeEndpoint, {
            headers: {
              'X-Mashape-Key': telizeHash,
              Accept: 'text/plain',
            },
          }, (e, r) => {
            const ip = r && r.content || 'blocked';
            Meteor.call('setMxpDid', mixpanel.get_distinct_id(), ls, raf, ip);
            mixpanel.people.set({
              ip,
              // name: user.profile.name,
              // $first_name: user.profile.firstName,
              // $last_name: user.profile.lastName,
              // $email: user.emails && user.emails[0] && user.emails[0].address || null,
              // $created: (user.created || new Date()).toISOString(),
            });
            // FlowRouter.go('myboards');
          }
        );
      }, 2);
    }
    // Else we've already aliased to user
    // and have nothing to do other than identify

    mixpanel.identify(Meteor.userId());
    mixpanel.people.set(); // have to do this to reset lastActivity
  } else {
    loggedInAliasRun = false;
    mixpanel.people.set(); // have to do this to reset lastActivity

    // We don't care if mxpdid is undefined
    // and it will be most often
    // this is intended for cross domain identification
    mixpanel.identify(mxpdid);

    // console.log('mixpanel.js - tagVisitor: ', mixpanel.get_property('showSplash'));
    if (mixpanel.get_property('showSplash') === undefined) {
      mixpanel.register({ showSplash: 0 });  // turned off right now, set to 1 to activate
    }

    // if there is a raf, treat that as first source for ls
    mixpanel.people.set_once({ leadSource: raf || ls || 'organic' });
    mixpanel.register_once({ leadSource: raf || ls || 'organic' });

    utu.identity({
      custom: {
        leadSource: raf || ls || 'organic',
      },
    });

    if (raf) {
      mixpanel.people.set({ raf });
      mixpanel.register({ raf });
      utu.identity({
        custom: {
          raf,
        },
      });
    }
  }
};

utu.init(Meteor.settings.public.utu.token);
mixpanel.init(Meteor.settings.public.mixpanel.token, {
  loaded() { Meteor.startup(() => Tracker.autorun(tagVisitor)); },
});

// Should only be used in tests
export { tagVisitor };
