import React from 'react';
import { storiesOf } from '@kadira/storybook';
import ProfileShow from '../../../imports/ui/profile/show.comp.jsx';

storiesOf('Profile show', module)
  .add('active user', () => (
    <ProfileShow
      img={'http://lorempixel.com/400/200'}
      title={'101 things I love'}
      description={'Pushing the edge of taste and economy.  A shopper in the northwest who…….lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum'}
      clipCount={10}
      boardCount={10}
      favoriteCount={100}
      blogUrl={'www.google.com'}
      retailerUrl={'www.google.com'}
      facebookUrl={'facebook.com'}
      facebookCount={10}
      twitterUrl={'twitter.com'}
      twitterCount={30}
      pinterestUrl={'twitter.com'}
      pinterestCount={30000}
      instagramUrl={'twitter.com'}
      instagramCount={50000000}
    />
  ))
  .add('new user', () => (
    <ProfileShow
      img={'http://lorempixel.com/400/200'}
    />
  ));
