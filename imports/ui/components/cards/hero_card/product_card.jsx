import React, { Component, PropTypes } from 'react';
import shallowCompare from 'react-addons-shallow-compare';
import { HeroCard, UserInfo, navigateToBoard, navigateToProduct } from './card';
import { Toolbar, Counts } from '../../../lib/card';
import FavoriteBtn from '../../../clips/favoriteIcon';
import Share from '../../../clips/shareIcon';
import Reclip from '../../../clips/reclipIcon';
// import { FlowRouter } from 'meteor/kadira:flow-router';

class Card extends React.Component {
  render() {
    const {
      title,
      caption,
      price,
      creator,
      image,
      boardTitle,
      _id,
      boardId,
      favoriteCount,
      hideCreator,
      hideBoard,
    } = this.props;

    return (
      <div className="product-card">
        <div className="details" onClick={navigateToProduct(_id)}>
          {
            image && <img src={image} alt={title} />
          }
          <p className="title clamp clamp-2">{title}</p>
          {
            caption && (
              <p className="caption clamp clamp-6">{caption}</p>
            )
          }
          <Counts favorites={favoriteCount} price={price} />
        </div>
        {!hideCreator &&
          <UserInfo
            image={creator && creator.getImage() || ''}
            username={creator && creator.username || ''}
            subtext={!hideBoard ? boardTitle : ''}
            onClick={navigateToBoard(boardId)}
          />
        }
        <Toolbar>
          <FavoriteBtn clipId={_id} />
          <Share clipId={_id} />
          <Reclip clipId={_id} />
        </Toolbar>
      </div>
    );
  }
}


Card.propTypes = {
  title: PropTypes.string,
  caption: PropTypes.string,
  price: PropTypes.number,
  favoriteCount: PropTypes.number,
  creator: PropTypes.object,
  image: PropTypes.string,
  boardTitle: PropTypes.string,
  _id: PropTypes.string,
  boardId: PropTypes.string,
  hideCreator: PropTypes.bool,
  hideBoard: PropTypes.bool,
};

export default class ProductCard extends Component {
  shouldComponentUpdate(nextProps, nextState) {
    return shallowCompare(this, nextProps, nextState);
  }

  render() {
    const image = _.first(this.props.images);
    const hideCreator = this.props.hideCreator;
    return (
      <HeroCard status={this.props.status}>
        <Card {...this.props} image={image && image.href} hideCreator={hideCreator} />
      </HeroCard>
    );
  }
}

ProductCard.propTypes = {
  status: PropTypes.number,
  images: PropTypes.array,
  hideCreator: PropTypes.bool,
};
