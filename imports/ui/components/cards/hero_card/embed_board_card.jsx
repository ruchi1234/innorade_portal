/* global utu */
import React, { Component, PropTypes } from 'react';
import shallowCompare from 'react-addons-shallow-compare';
import { FlowRouter } from 'meteor/kadira:flow-router';
import { Title, Details, HeroCard, UserInfo, ResponsiveThumbs, Carousel } from './card';
import { Counts } from '../../../lib/card';
import { composeWithTracker } from 'react-komposer';
import data from '/imports/data/boards/byId';
import Loader from '/imports/ui/components/loader';
import mixpanel from 'mixpanel-browser';

const BoardCard = ({ children, unlocked }) => (
  <div className={`board-card embed ${unlocked ? 'unlocked' : ''}`}>
    {children}
  </div>
);

BoardCard.propTypes = {
  children: PropTypes.node.isRequired,
  unlocked: PropTypes.bool.isRequired,
};

const Card = (props) => {
  const {
    creator,
    creatorImage,
    images,
    favoriteCount,
    title,
    itemCount,
    boardImages,
    status,
  } = props;

  const carouselImages = (boardImages && boardImages.length) ? boardImages : images.slice(0, 1);

  return (
    <BoardCard unlocked={!status}>
      <Details>
        <Carousel
          alt={title}
          images={carouselImages}
        />
        <ResponsiveThumbs images={images} />
        <Title title={title} />
        <Counts favorites={favoriteCount} clips={itemCount} />
      </Details>
    </BoardCard>
  );
};

Card.propTypes = {
  _id: PropTypes.string,
  creator: PropTypes.object,
  creatorImage: PropTypes.string,
  images: PropTypes.array,
  boardImages: PropTypes.array,
  favoriteCount: PropTypes.number,
  favorited: PropTypes.bool,
  status: PropTypes.string,
  title: PropTypes.string,
  itemCount: PropTypes.number,
};

Card.propTypes = {
  creator: PropTypes.object.isRequired,
  creatorImage: PropTypes.string,
  images: PropTypes.array.isRequired,
  favoriteCount: PropTypes.number.isRequired,
  itemCount: PropTypes.number.isRequired,
  favorited: PropTypes.bool.isRequired,
  status: PropTypes.number.isRequired,
};

class EmbedBoardCard extends Component {
  shouldComponentUpdate(nextProps, nextState) {
    return shallowCompare(this, nextProps, nextState);
  }

  render() {
    const { board, ready, boardId } = this.props;

    if (!ready || !board) {
      return (
        <section>
          <Loader />
        </section>
      );
    }

    const creator = board.getCreator();
    const card = _.pick(board, '_id', 'status', 'title', 'type', 'creator');
    card.cardType = 'board';

    if (board.getImage()) {
      card.images = [({ href: board.getImage() }), ...board.boardProductImages].filter((e) => e);
    } else {
      card.images = (board.boardProductImages || []).filter((e) => e);
    }

    card.itemCount = board.boardProductCount;
    card.status = board.status; // 0 = open
    card.boardImages = (board.images || []).filter((o) => o);
    card.favoriteCount = board.favoritedByIds && board.favoritedByIds.length || 0;
    card.favorited = board.userFavorite();

    card.title = board.title;
    card.imageUrl = board.getImage() || board.getBoardProductImage();

    const goToBoard = () => {
      mixpanel.track('Clicked Embed Board', {
        site: window.location.hostname,
      });
      utu.track('Clicked Embed Board', {
        site: window.location.hostname,
      });
    };

    return (
      <a href={FlowRouter.url('board', { _id: board._id })} target="_blank" onClick={goToBoard}>
        <HeroCard>
          <Card
            creatorName={creator.username}
            creatorId={creator.userId}
            creatorImage={creator.getImage()}
            {...card}
            _id={boardId}
          />
        </HeroCard>
      </a>
    );
  }
}

EmbedBoardCard.propTypes = {
  creatorImage: PropTypes.string,
  status: PropTypes.number,
  board: PropTypes.object,
  boardId: PropTypes.string,
  ready: PropTypes.bool,
};

export default composeWithTracker(data)(EmbedBoardCard);
