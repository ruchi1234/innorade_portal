/* global utu */
import React from 'react';
import { composeWithTracker, composeAll } from 'react-komposer';
import data from '/imports/data/clips/byId';
import mixpanel from 'mixpanel-browser';

import Loader from '/imports/ui/components/loader';
import CanHOF from '/imports/modules/can/can_hof';
import FavoriteClip from '/imports/api/clips/methods/favorite';
import HeroCard from '/imports/ui/components/cards/hero_card/embed_product_card';
import FlowHelpers from '/imports/startup/flow_helpers';
import { showLogin } from '/imports/ui/components/login/modal';

/*
** file: client.clipHeader_Container.jsx
** by: MavenX - tewksbum Mar 2016
**              JimmieB May 2016
** re: Basic layout for top nav and grid body
*/

const EmbedClip = React.createClass({
  propTypes: {
    clip: React.PropTypes.object,
    ready: React.PropTypes.bool,
  },

  render() {
    const { clip, ready, hideCreator, hideBoard } = this.props;

    if (!ready || !clip) {
      return (
        <section>
          <Loader />
        </section>
      );
    } else {
      const creator = clip.getCreator();
      let card = _.pick(clip, '_id', 'boardId', 'boardTitle', 'caption', 'creator',
        'creatorId', 'domain', 'images', 'itemCount', 'price', 'productId', 'status',
        'title', 'type', 'network', 'description', 'aurlType', 'aurl', 'retailer');

      console.log("embedClip");
      console.log(this.props);

      card.cardType = 'product';
      card.creator = creator;
      card.favoriteCount = clip.favoritedByIds && clip.favoritedByIds.length || 0;
      card.favorited = clip.userFavorite();
      card.url = FlowHelpers.urlFor('product', { _id: card._id });
      card.rurl = clip.url;
      card.title = clip.title;
      card.imageUrl = clip.getImage();
      card.affiliateUrl = clip.aurl &&
        FlowRouter.url(
          'mixpanelTrack',
          {},
          {
            url: encodeURIComponent(clip.aurl),
            clipId: clip._id,
            retailer: clip.retailer,
          }
      );

      card.shareCaption = clip.caption;

      const toggleFavorite = CanHOF({
        action: 'favorite',
        type: 'clip',
        handleLogin: () => {
          showLogin({ message: 'To favorite a clip you must first register!' });
        },
        handleAction: () => {
          FavoriteClip.call({
            _id: clip._id,
            favorite: !clip.userFavorite(),
          }, () => {
            mixpanel.track(`${clip.favorite ? 'Fav' : 'Unfav'} Clipping`, {
              clipId: clip._id,
            });
            utu.track(`${clip.favorite ? 'Fav' : 'Unfav'} Clipping`, {
              clipId: clip._id,
            });
          });
        },
      });

      return (
        <HeroCard
          {...card}
          toggleFavorite={toggleFavorite}
          typeLabel="product"
          hideCreator={hideCreator}
          hideBoard={hideBoard}
        />
      );
    }
  },
});

const EmbedClipWData = composeAll(
  composeWithTracker(data)
)(EmbedClip);
export default EmbedClipWData;
export { EmbedClip };
