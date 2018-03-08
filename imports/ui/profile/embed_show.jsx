import React from 'react';
import { Meteor } from 'meteor/meteor';
import ProfileCard from '/imports/ui/components/cards/hero_card/embed_profile_card';

import { composeWithTracker } from 'react-komposer';
import Subscriptions from '../../data/subscriptions.js';

export default composeWithTracker((props, onData) => {
  onData(null, { ready: false });
  const handle = Subscriptions.subscribe('pubProfileData', props.slug);
  const user = Meteor.users.findOne({ slug: props.slug });
  if (handle.ready() && user) {
    onData(null, {
      ready: true,
      img: user.getImage(),
      title: user.username,
      bio: user.profile.bio,

      retailerUrl: user.profile.retailerUrl,
      blogUrl: user.profile.blogUrl,

      facebookCount: user.profile.facebookFriends,
      twitterCount: user.profile.twitterFollowers,
      pinterestCount: user.profile.pinterestFriends,
      instagramCount: user.profile.instagramFriends,

      clipCount: user.profile.clipCount,
      boardCount: user.profile.boardCount,
      favoritedCount: user.favoritedCount,
    });
  }
})(ProfileCard);
