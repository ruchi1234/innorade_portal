/* global utu */
import React from 'react';
import { Meteor } from 'meteor/meteor';
import { Tracker } from 'meteor/tracker';
import { _ } from 'meteor/underscore';
import { FlowRouter } from 'meteor/kadira:flow-router';
import { composeWithTracker, composeAll } from 'react-komposer';
import shallowCompare from 'react-addons-shallow-compare';

import Subscriptions from '../../../data/subscriptions';
import calcQuery from '../../../modules/calculate_query';
import Boards from '../../../modules/boards/collection';
import FavoriteBoard from '../../../api/boards/methods/favorite';
import canHOF from '../../../modules/can/can_hof';
import pagedMasonryHOC from '../masonry/paged_masonry_hoc';
import GalleryCard from '../cards/hero_card/board_card';
import { filterState, keywordState } from '../bars/search_bar';
import routeState from '../../../data/misc/route';
import PageMessage from '../page_message';
import NoMyBoardsNonuser from './my/empty/nonuser';
import NoMyBoards from './my/empty/empty';
import loginState from '../../../data/users/login_state';

import mixpanel from 'mixpanel-browser';

const calcQueryHelpers = (props) => {
  const qh = ['sorted', 'paged', 'limit', 'byKeyword'];
  if (props.queryHelpers) {
    qh.push(...props.queryHelpers);
  }
  return qh;
};

class Tile extends React.Component {
  shouldComponentUpdate(nextProps, nextState) {
    return shallowCompare(this, nextProps, nextState);
  }

  render() {
    const { doc } = this.props;
    const creator = doc.getCreator();
    let card = _.pick(doc, '_id', 'status', 'title', 'type', 'creator');
    card.cardType = 'board';

    if (doc.getImage()) {
      card.images = [({ href: doc.getImage() }), ...doc.boardProductImages].filter((e) => e);
    } else {
      card.images = (doc.boardProductImages || []).filter((e) => e);// above inserts an empty object
    }

    card.itemCount = doc.boardProductCount;
    card.status = doc.status; // 0 = open
    card.boardImages = (doc.images || []).filter((o) => o);
    card.favoriteCount = doc.favoritedByIds && doc.favoritedByIds.length || 0;
    card.favorited = doc.userFavorite();

    card.url = FlowRouter.url('board', { _id: doc._id });
    card.title = doc.title;
    card.imageUrl = doc.getImage() || doc.getBoardProductImage();

    const toggleFavorite = canHOF({
      action: 'favorite',
      type: 'board',
      handleLogin: () => {
        showLogin({ message: 'To favorite a board you must first register!' });
      },
      handleAction: () => {
        FavoriteBoard.call({
          _id: doc._id,
          favorite: !doc.userFavorite(),
        }, () => {
          mixpanel.track(`${doc.favorite ? 'Fav' : 'Unfav'} Board`, {
            boardId: doc._id,
          });
          utu.track(`${doc.favorite ? 'Fav' : 'Unfav'} Board`, {
            boardId: doc._id,
          });
        });
      },
    });

    return (<GalleryCard
      card={card}
      typeLabel="board"
      toggleFavorite={toggleFavorite}

      creatorName={creator.username}
      creatorId={creator.userId}
      creatorImage={creator.getImage()}
    />);
  }
}

Tile.propTypes = {
  doc: React.PropTypes.object.isRequired,
};

/*
 * Wolud prefer separate masonry components for myboard vs boards
 */
const EmptyMessage = composeAll(
  composeWithTracker(filterState),
  composeWithTracker(routeState),
  composeWithTracker(keywordState),
  composeWithTracker(loginState)
)(({ filter, routeName, keyword, loggedIn }) => {
  if (keyword && keyword !== '' && keyword !== null) {
    return (
      <PageMessage>
        <p>
          No boards were found that contain your search terms. Please try new search terms.
        </p>
      </PageMessage>
    );
  }

  if (routeName === 'myboards') {
    if (filter === 'Public') {
      return (
        <PageMessage>
          <p>You have no public boards.</p>
          <p>
            Why not create a public board with your favorite products and share
            that with your friends and followers? You can share public boards
            using email and by publishing the boards to social media sites (like
            Facebook) or on your own blog. To get started, tap the “Build a Board
            to Share” button above.
          </p>
        </PageMessage>
      );
    } else if (filter === 'Private') {
      return (
        <PageMessage>
          <p>You have no private boards. </p>
          <p>
            Are you new to “private” boards? Private boards let you share product
            ideas with only the people you choose. These boards are not displayed
            in the public areas of Maven Xchange. So, if you want to privately share
            product ideas with people you know, tap the “Build a Board to Share”
            button to get started. You earn if they buy!
          </p>
        </PageMessage>
      );
    } else if (filter === 'Open') {
      return (
        <PageMessage>
          <p>You have no open boards. </p>
          <p>
            What is an “open” board? When you create an “open” board, other members
            can put clippings for products they recommend onto your board. Use open
            boards when you are looking for help finding just the right product or
            when you want to collaborate on a collection with a group.
          </p>
          <p>
            To create an open board, tap the “Get Recommendations” button.
            You’ll be able to get product ideas from other users at Maven Xchange or
            from just friends you know.
          </p>
        </PageMessage>
      );
    }
    if (loggedIn) {
      return (<NoMyBoards />);
    } else {
      return (<NoMyBoardsNonuser />);
    }
  }
  if (filter === 'Favorite') {
    return (
      <PageMessage>
        <p>You don’t have any favorite boards.</p>
        <p>
          The favorite button lets you mark boards that you like.
          Any board you favorite will appear here. To favorite a board, simply
          tap the heart button on the board. To remove a board from your favorite
          list, just tap the heart button again.
        </p>
      </PageMessage>
    );
  } else if (filter === 'Open') {
    return (
      <PageMessage>
        <p>
          There are no open public boards right now. Come back later to see
          who might be looking for your product recommendations! Or create your
          own open board to get recommendations!
        </p>
      </PageMessage>
    );
  } else if (filter === 'Top') {
    return (
      <PageMessage>
        <p>
          We’re sorry.  There are no “top picks” right now.
          But, please come back later to see the boards that our
          experts think are the Best of the Maven Xchange.
        </p>
      </PageMessage>
    );
  }
  return (
    <PageMessage>
      <p>
        We’re sorry. Our system is not available right now. Please come back later.
      </p>
    </PageMessage>
  );
});

/*
 * This component is a bastard
 * We've thrown pretty much everything into here...
 * was intended to only be used for a single page, instead
 * it's on at least 3 completely different pages.
 */
const BoardsPagedMasonry = pagedMasonryHOC({
  className: 'masonry-board',
  pageSubscribe(props) {
    const keyword = props.keyword ? props.keyword : '';
    const queryHelpers = calcQueryHelpers(props);
    return Subscriptions.subscribe('boardsByKeyword', keyword, queryHelpers, props.page, props.slug);
  },

  pageDocuments(props) {
    // Calculate Params
    const params = _.pick(props, 'page');
    params.keyword = (props.keyword || '');
    params.slug = props.slug;
    params.userId = Meteor.userId();

    // Calc query helpers used
    const queryHelpers = calcQueryHelpers(props);

    const query = calcQuery(Boards.queryHelpers, queryHelpers, params);
    let boards;
    // console.log('board PM Q: ', JSON.stringify(query));
    if (!props.reactive) {
      Tracker.nonreactive(() => {
        boards = Boards.find(...query).fetch();
      });
    } else {
      boards = Boards.find(...query).fetch();
    }
    return boards;
  },

  Tile,

  EmptyMessage,
});

export default BoardsPagedMasonry;
