/* global utu */
import React from 'react';
import { Meteor } from 'meteor/meteor';
import { _ } from 'meteor/underscore';
import mixpanel from 'mixpanel-browser';
import { Tracker } from 'meteor/tracker';
import { composeAll, composeWithTracker } from 'react-komposer';

import { FlowRouter } from 'meteor/kadira:flow-router';
import Subscriptions from '/imports/data/subscriptions';
import { CalculateQuery } from '/imports/modules/calculate_query';
import BoardProducts from '/imports/modules/clips/collection';
import Boards from '/imports/modules/boards/collection';

import CanHOF from '/imports/modules/can/can_hof';
import shallowCompare from 'react-addons-shallow-compare';
import FlowHelpers from '/imports/startup/flow_helpers';
import { filterState, keywordState } from '/imports/ui/components/bars/search_bar';
import PagedMasonryHOC from '/imports/ui/components/masonry/paged_masonry_hoc';
import PageMessage from '/imports/ui/components/page_message';
import HeroCard from '/imports/ui/components/cards/hero_card/product_card';
import GetMaveletVideo from '/imports/ui/components/get_mavelet_video';
import routeState from '/imports/data/misc/route';
import loginState from '/imports/data/users/login_state';
import routeParamStateHOF from '/imports/data/misc/routeParamHOF';
import routeQueryParamStateHOF from '/imports/data/misc/routeParamHOF';
import { showLogin } from '/imports/ui/components/login/modal';
import BoardNoProducts from '../boards/no_products';
import showClipModal from '/imports/ui/components/clip/add_modal';

class Tile extends React.Component {
  shouldComponentUpdate(nextProps, nextState) {
    return shallowCompare(this, nextProps, nextState);
  }

  render() {
    const { doc, hideCreator, hideBoard } = this.props;
    const card = _.pick(doc, '_id', 'boardId', 'boardTitle', 'caption', 'creator',
      'creatorId', 'domain', 'images', 'itemCount', 'price', 'productId', 'status',
      'title', 'type', 'network', 'description', 'aurlType');

    card.cardType = 'product';
    card.creator = doc.getCreator();
    card.favoriteCount = doc.favoritedByIds && doc.favoritedByIds.length || 0;
    card.favorited = doc.userFavorite();
    card.url = FlowHelpers.urlFor('product', { _id: card._id });
    card.rurl = doc.url;
    card.title = doc.title;
    card.imageUrl = doc.getImage();
    card.affiliateUrl = doc.aurl &&
      FlowRouter.url(
      'mixpanelTrack',
      {},
      { url: encodeURIComponent(doc.aurl),
        clipId: doc._id,
        retailer: doc.retailer,
      }
    );

    // This is exactly why we need a shallower render tree.
    // This section needs a refactor still.
    card.shareCaption = doc.caption;

    const toggleFavorite = CanHOF({
      action: 'favorite',
      type: 'clip',
      handleLogin: () => {
        showLogin({ message: 'To favorite a clip you must first register!' });
      },
      handleAction: () => {
        FavoriteClip.call({
          _id: doc._id,
          favorite: !doc.userFavorite(),
        }, () => {
          mixpanel.track(`${doc.favorite ? 'Fav' : 'Unfav'} Clipping`, {
            clipId: doc._id,
          });
          utu.track(`${doc.favorite ? 'Fav' : 'Unfav'} Clipping`, {
            clipId: doc._id,
          });
        });
      },
    });

    return (<HeroCard
      {...card}
      toggleFavorite={toggleFavorite}
      typeLabel="product"
      hideCreator={hideCreator}
      hideBoard={hideBoard}
    />);
  }
}

Tile.propTypes = {
  doc: React.PropTypes.object.isRequired,
};

// Ideally we'll have separate masonry components for the different pages (related, detail, list, my etc)
// and not need this shit show anymore
const EmptyMessage = composeAll(
  composeWithTracker(filterState),
  composeWithTracker(keywordState),
  composeWithTracker(routeState),
  composeWithTracker(routeParamStateHOF('_id')),
  composeWithTracker(routeQueryParamStateHOF('category')),
  composeWithTracker(loginState)
)(({ filter, routeName, keyword, category, userId, _id }) => {
  if (keyword || category) {
    return (
      <PageMessage >
        <p>
          No products were found that contain your search terms. Please try new search terms.
        </p>
      </PageMessage>
    );
  }
  if (routeName === 'board') {
    const board = Boards.findOne(_id);
    if (board.creatorId === userId) {
      return <BoardNoProducts handleClip={() => showClipModal({ boardId: _id })} />;
    } else if (!board.status) { // board is open
      return (
        <PageMessage >
          <p>
            There are no products on this board yet, but this board is open.
            So, the person who created this board is looking for your recommendations.
            Why not help them out?
          </p>
          <p>
            Do you have products to recommend? Use the <a href={FlowRouter.path('getmavelet')}>Mavelet</a> to add product clippings to
            this board as you shop. Or, tap the “add a clipping” button above to add a new
            product to this board. If they buy, you earn!
          </p>
          <p>
            Want to learn more about the <a href={FlowRouter.path('getmavelet')}>Mavelet</a>?  Watch this video.
          </p>
          <GetMaveletVideo width="300px" height="300px" />
        </PageMessage>
      );
    } else {
      return (
        <PageMessage >
          <p>
            There are no products on this board yet.
          </p>
        </PageMessage>
      );
    }
  } else if (routeName === 'myproducts') {
    return (
      <PageMessage>
        <p>
          Oh no! You don’t have any product clippings. Without product clippings, you can’t earn.
        </p>
        <p>
          A fast way to get a product clipping is to find a product you like in the
          <a href={FlowRouter.path('products')}> Product </a>
          section and re-clip it onto your own board.
        </p>
        <p>
          You can easily add new product clippings to Maven Xchange while browsing on retailers’
          sites and using our Mavelet. <a href={FlowRouter.path('getmavelet')}>Tap here </a>to
          learn more and get started.
        </p>
        <p>
          You can also add new product clippings using a product URL. A product URL is that long
          webpage address that is displayed in the top of your browser when you’re on a product
          page at a retailer’s site. By simply copying the product URL into Maven Xchange, Maven
          Xchange will automatically create the product clipping for you. When you have a product
          URL, tap the “Add Product” button above.
        </p>
      </PageMessage>
    );
  } else {
    if (filter === 'Favorite') {
      return (
        <PageMessage>
          <p>
            You don’t have any favorite products.
          </p>
          <p>
            The favorite button lets you mark products that you like.
            Any product you favorite will appear here.
            To favorite a product, simply tap the heart button on the product.
            To remove a product from your favorite list, just tap the heart button again.
          </p>
        </PageMessage>
      );
    } else {
      return (
        <PageMessage>
          <p>
            We’re sorry. Our system is not available right now. Please come back later.
          </p>
        </PageMessage>
      );
    }
  }
});

const calcQueryHelpers = (props) => {
  const qh = ['sorted', 'paged', 'limit'];
  if (props.queryHelpers) {
    qh.push(...props.queryHelpers);
  }
  return qh;
};


const BProductsPagedMasonry = PagedMasonryHOC({
  tileProps(props) {
    if (FlowRouter.current().route.name === 'board') {
      const board = Boards.findOne(props.boardId);
      if (board) {
        return { hideCreator: !!board.status, hideBoard: true };
      }
      return { hideBoard: true };
    }

    return {};
  },

  pageSubscribe(props) {
    const keyword = props.keyword ? props.keyword : '';
    const queryHelpers = calcQueryHelpers(props);
    return props.boardId ?
      Subscriptions.subscribe('boardProductsByBoardId', props.boardId, queryHelpers, props.page) :
      Subscriptions.subscribe('boardProductsByKeyword', keyword, queryHelpers, props.category, props.page);
  },

  pageDocuments(props) {
      // Calculate Params
    const params = _.pick(props, 'boardId', 'page', 'category');
    params.keyword = (props.keyword || '');
    params.userId = Meteor.userId();

    // Calc query helpers used
    const queryHelpers = calcQueryHelpers(props);
    queryHelpers.push('byCategory');
    if (!props.reactive) { queryHelpers.push('nonReactive'); }

    // By boardId or by keyword
    props.boardId ?
      queryHelpers.push('byBoardId') :
      queryHelpers.push('byKeyword');

    const query = CalculateQuery(BoardProducts.queryHelpers, queryHelpers, params);
    let bps;
    if (props.reactive) {
      bps = BoardProducts.find(...query).fetch();
    } else {
      Tracker.nonreactive(() => {
        bps = BoardProducts.find(...query).fetch();
      });
    }
    return bps;
  },

  Tile,
  EmptyMessage,
});


export default BProductsPagedMasonry;
