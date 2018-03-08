/* global utu */
import React, { Component, PropTypes } from 'react';
import shallowCompare from 'react-addons-shallow-compare';
import { HeroCard, UserInfo, navigateToBoard, navigateToProduct } from './card';
import { Counts } from '../../../lib/card';
import canHOF from '/imports/modules/can/can_hof';
import mixpanel from 'mixpanel-browser';
import Img from '/imports/ui/components/img';

class Card extends React.Component {
  render() {
    const {
      aurl,
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
      retailer,
    } = this.props;

    const handleClip = canHOF({
      action: 'insert',
      type: 'clip',
      authDenyMsg: 'To re-clip a product, please login or create an account.',
      handleAction: () => this.refs.reclipModal.show(),
    });

    const goToClip = () => {
      mixpanel.track('Clicked Embed Clip', {
        clipId: _id,
        retailer: retailer,
        clipCreator: creator.userId,
        boardId,
      });
      utu.track('Clicked Embed Clip', {
        clipId: _id,
        retailer: retailer,
        clipCreator: creator.userId,
        boardId,
      });
      window.open(`${aurl}`);
    };

    const goToBoard = () => {
      mixpanel.track('Clicked Embed Board', {
        site: window.location.hostname,
      });
      utu.track('Clicked Embed Board', {
        site: window.location.hostname,
      });
      window.open(`${Meteor.absoluteUrl()}board/${boardId}`);
    };

    return (
      <div className="product-card embed">
        <div className="details" onClick={goToClip}>
          {
            image && <Img src={image} alt={title} className="embed-image" />
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
            onClick={goToBoard}
          />
        }
      </div>
    );
  }
}

Card.propTypes = {
  aurl: PropTypes.string,
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
