import React, { Component, PropTypes } from 'react';
import shallowCompare from 'react-addons-shallow-compare';
import { FlowRouter } from 'meteor/kadira:flow-router';
import Carousel from '../../carousel';
import { HeroCard, UserInfo, ResponsiveThumbs } from './card';
import { Toolbar, Counts } from '../../../lib/card';
import Img from '../../img';
import Share from '../../../boards/shareIcon';
import Favorite from '../../../boards/favoriteIcon.jsx';

const BoardCarousel = ({ images, alt }) => {
  if (!images || !images.length) {
    return <div className="img-container" />;
  }

  return (
    <div
      className={`img-container ${images.length === 1 && 'single-image' || ''}`}
    >
      {
        images.length > 1 && (
          <Carousel maxIndicatorCount={3}>
            {
              images.map((image, key) => (
                image && <Img src={image.href} key={key} role="presentation" alt={alt} fullWidth />
              ))
            }
          </Carousel>
        ) || (
          images[0] && <Img src={images[0].href} role="presentation" fullWidth />
        )
      }
    </div>
  );
};

BoardCarousel.propTypes = {
  images: PropTypes.array,
  alt: PropTypes.string,
};

class Card extends React.Component {
  render() {
    const {
      _id,
      creator,
      creatorImage,
      images,
      favoriteCount,
      title,
      itemCount,
      boardImages,
      status,
    } = this.props;

    const carouselImages = (boardImages && boardImages.length) ? boardImages : images.slice(0, 1);
    const goToBoard = () => FlowRouter.go('board', { _id });
    const goToProfile = () => FlowRouter.go('profile', { slug: creator.slug });

    return (
      <div className={`board-card ${!status ? 'unlocked' : ''}`}>
        <UserInfo
          image={creatorImage}
          username={creator && creator.username || ''}
          favoritedCount={creator && creator.favoritedCount}
          onClick={goToProfile}
        />
        <div className="details" onClick={goToBoard}>
          <BoardCarousel
            alt={title}
            images={carouselImages}
            onClick={goToBoard}
          />
          <ResponsiveThumbs images={images} />
          <div className="title-container">
            <p className="title clamp clamp-2">{title}</p>
          </div>
          <Counts favorites={favoriteCount} clips={itemCount} />
        </div>
        <Toolbar>
          <Favorite boardId={_id} />
          <Share boardId={_id} />
        </Toolbar>
      </div>
    );
  }
}

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

export default class BoardCard extends Component {
  shouldComponentUpdate(nextProps, nextState) {
    return shallowCompare(this, nextProps, nextState);
  }

  render() {
    return (
      <HeroCard>
        <Card {...this.props} {...this.props.card} />
      </HeroCard>
    );
  }
}

BoardCard.propTypes = {
  creatorImage: PropTypes.string,
  card: PropTypes.object.isRequired,
  status: PropTypes.number,
};
