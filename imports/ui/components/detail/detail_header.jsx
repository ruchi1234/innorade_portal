/* global utu */
import React from 'react';
import { Meteor } from 'meteor/meteor';

import UnlockedIcon from '../../lib/icons/unlocked';
import BoardSpotlight from '/imports/ui/components/boards/spotlight';
import Carousel from '/imports/ui/components/carousel';
import Img from '/imports/ui/components/img.jsx';
import Counts from '/imports/ui/components/counts';

import mixpanel from 'mixpanel-browser';

const carouselHeight = 450;

// Main purpose of this is to
// avoidthe re-render when the rest of the page updates
class CarouselHelper extends React.Component {
  shouldComponentUpdate(nextProps) {
    return !_.isEqual(nextProps.images, this.props.images);
  }

  render() {
    const { images, alt } = this.props;
    return (
      <Carousel>
        {(images || []).map((i) => i && <Img key={i.href} src={i.href} alt={alt} height={carouselHeight} />)}
      </Carousel>
    );
  }
}

CarouselHelper.propTypes = {
  images: React.PropTypes.array,
  alt: React.PropTypes.string,
};

/*
** file: client.components.detail_header
** by: MavenX - tewksbum May 2016
**              jimmiedb jun 2016
** re: Detail header
*/

const DetailHeader = React.createClass({
  propTypes: {
    typeLabel: React.PropTypes.string,
    purchaseLink: React.PropTypes.string,

    creatorName: React.PropTypes.string.isRequired,
    creatorImage: React.PropTypes.string.isRequired,
    creatorId: React.PropTypes.string.isRequired,
    creatorFavoritedCount: React.PropTypes.number,
    creator: React.PropTypes.object,

    detail: React.PropTypes.object.isRequired,
  },

  getDefaultProps() {
    return {
      images: [],
      caption: '',
      title: '',
    };
  },

  onClickClip(e) {
    e.preventDefault();
    if (this.props.detail.aurl) {
      utu.track('AURL - Title', {
        clipId: this.props.detail._id,
        clipCreator: this.props.creatorId || 'unknown',
        retailer: this.props.detail.retailer,
        board: this.props.detail.boardId,
      });
      mixpanel.track('AURL - Title', {
        clipId: this.props.detail._id,
        clipCreator: this.props.creatorId || 'unknown',
        retailer: this.props.detail.retailer,
        boardId: this.props.detail.boardId,
      });
      window.open(this.props.detail.aurl, '_blank');
    }
  },

  render() {
    const {
      alwaysShowImages,
      creatorName,
      creatorImage,
      creatorId,
      creatorFavoritedCount,
      creator,
      purchaseLink,

      toolbarBtns,
    } = this.props;

    const {
      boardId,
      caption,
      description,
      faves,
      images,
      price,
      retailer,
      status,
      title,
      type,
      _id,
    } = this.props.detail;

    console.log(this.props);

    const _private = type !== 0 ? 'private ' : '';
    const _sectionClass = `detail ${_private}`;
    const _isCreator = creatorId === Meteor.userId();

    const goToProfile = () => FlowRouter.go('profile', { slug: creator.slug });

    const showImages = (alwaysShowImages || (images && images.length));
    return (
      <section className={_sectionClass}>
        <div className={`container ${showImages ? 'images-height' : ''}`}>
          {(showImages) > 0 &&
            <div className="images">
              <CarouselHelper images={images} alt={title} />
            </div>
          }

          {purchaseLink && (
            <div className="disclosure">
              <a href="http://about.mavenx.com/link-disclosure" target="_blank">
                Users earn from merchant links
              </a>
            </div>
          )}

          <div className="user-info">
            <Img src={creatorImage} className="user-image" circle onClick={goToProfile} />
            <span className="user-name" onClick={goToProfile}>{creatorName}
              {typeof creatorFavoritedCount != "undefined" &&
                <Counts favorites={creatorFavoritedCount} />
              }
            </span>
            {purchaseLink &&
              <Counts favorites={faves || 0} />
            }
          </div>

          <h2
            className="title clamp clamp-2"
            onClick={this.onClickClip}
          >
            {title}
          </h2>

          {!purchaseLink &&
            <div className="info-bar">
              <div className="counts-wrap">
                <Counts favorites={faves || 0} clips={this.props.detail.clips} />
                {!status && <UnlockedIcon />}
              </div>
            </div>
          }

          {caption &&
            <p className="caption clamp clamp-12">
              {caption}
            </p>
          }

          {purchaseLink &&
            <div className="purchase-info">
              <button
                className="btn-custom"
                onClick={() => {
                  utu.track('AURL - Button', {
                    clipId: _id,
                    clipCreator: creatorId || 'unknown',
                    retailer,
                    boardId,
                  });
                  mixpanel.track('AURL - Button', {
                    clipId: _id,
                    clipCreator: creatorId || 'unknown',
                    retailer,
                    boardId,
                  });
                  window.open(purchaseLink);
                }}
              >
                Visit Retailer
              </button>

              <div>
                <p
                  className="retailer clamp clamp-1"
                  onClick={() => {
                    utu.track('AURL - Retailer', {
                      clipId: _id,
                      clipCreator: creatorId || 'unknown',
                      retailer,
                      boardId,
                    });
                    mixpanel.track('AURL - Retailer', {
                      clipId: _id,
                      clipCreator: creatorId || 'unknown',
                      retailer,
                      boardId,
                    });
                    window.open(purchaseLink);
                  }}
                >
                  {retailer}
                </p>
                {price > 0 &&
                  <p className="price">
                    ${(price || 0).formatMoney()}
                  </p>
                }
              </div>
            </div>
          }

          <div className="toolbar-footer">
            <div>
              {toolbarBtns.map((btn, i) => {
                if (!btn) { return; }
                const Btn = () => btn;
                return <Btn key={i} />;
              })}
            </div>
          </div>

          {description &&
            <p className="description clamp clamp-4">
              {description}
            </p>
          }

          {boardId &&
            <div className="spotlight-wrapper">
              <BoardSpotlight boardId={boardId} />
            </div>
          }

        </div>
      </section>
    );
  },
});

export default DetailHeader;
