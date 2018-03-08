import React from 'react';
import { Meteor } from 'meteor/meteor';
import ProfileShow from './show.comp.jsx';
import { FlowRouter } from 'meteor/kadira:flow-router';
import { css, StyleSheet } from 'aphrodite';

import FavoriteIcon from '/imports/ui/profile/favoriteIcon';
import ShareIcon from '/imports/ui/profile/shareIcon';
import EditPopover from '/imports/ui/components/detail/edit_popover';
import EditIcon from '/imports/ui/lib/icons/edit.jsx';

import { composeWithTracker, composeAll } from 'react-komposer';
import Subscriptions from '../../data/subscriptions.js';
import updateDochead from '/imports/modules/update_dochead';

const setDochead = (user) => {
  const opts = {};

  if (user) {
    opts.title = user.username;
    opts.image = user.getImage();
    opts.description = user.bio || 'Visit my Page at mavenx.com';

    opts.creatorName = user.username;
    opts.keywords = `${opts.title || ''} Maven mavenx.com`;
    opts.url = FlowRouter.url('profile', { slug: user.slug });
  }
  opts.type = 'article';

  updateDochead(opts);
};

/*
 * TODO
 * Move this out of here, but not into show.comp.jsx
 */

const styles = StyleSheet.create({
  toolbar: {
    width: '200px',
    display: 'flex',
    justifyContent: 'space-between',
    flexBasis: '28px',
    alignItems: 'center',
    flexShrink: 0,
  },
});

const Toolbar = ({ id, slug, suser, showEdit }) => (
  <div className={css(styles.toolbar)}>
    <FavoriteIcon userId={id} />
    { showEdit && <EditIcon onClick={() => FlowRouter.go('profile')} /> }
    <ShareIcon userId={id} suser={suser} slug={slug} preferPlace="below" />
  </div>
);

export default composeWithTracker((props, onData) => {
  onData(null, { ready: false });
  const handle = Subscriptions.subscribe('pubProfileData', props.slug);
  const user = Meteor.users.findOne({ slug: props.slug });



  if (handle.ready() && user) {
    setDochead(user);

    const blogUrl = (user.profile && user.profile.blogUrl) &&
      (user.profile.blogUrl.includes('http') ? user.profile.blogUrl : `http://${user.profile.blogUrl}`);
    const retailerUrl = (user.profile && user.profile.retailerUrl) &&
      (user.profile.retailerUrl.includes('http') ? user.profile.retailerUrl : `http://${user.profile.retailerUrl}`);

    onData(null, {
      ready: true,
      img: user.getImage(),
      title: user.username,
      bio: user.profile.bio,

      retailerUrl,
      blogUrl,

      facebookUrl: user.profile.facebookId && `http://www.facebook.com/${user.profile.facebookId}`,
      twitterUrl: user.profile.twitterScreenName && `http://twitter.com/${user.profile.twitterScreenName}`,
      pinterestUrl: user.profile.pinterestUrl,
      instagramUrl: user.profile.instagramUsername && `http://www.instagram.com/${user.profile.instagramUsername}`,

      facebookCount: user.profile.facebookFriends,
      twitterCount: user.profile.twitterFollowers,
      pinterestCount: user.profile.pinterestFollowers,
      instagramCount: user.profile.instagramFollowers,

      clipCount: user.profile.clipCount,
      boardCount: user.profile.boardCount,
      favoritedCount: user.favoritedCount,

      toolbar: <Toolbar
        id={user._id}
        slug={user.slug}
        suser={user}
        showEdit={Meteor.userId() === user._id}
      />,
    });
  }
})(ProfileShow);
