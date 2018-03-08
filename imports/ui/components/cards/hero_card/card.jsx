import React, { PropTypes } from 'react';
import dimensions from 'react-dimensions';
import { FlowRouter } from 'meteor/kadira:flow-router';
import Img from '/imports/ui/components/img';
import RawCarousel from '/imports/ui/components/carousel';
import { Counts } from '../../../lib/card';

/**
 * Navigate to a board
 * @param  {String} _id the boardID
 */
export const navigateToBoard = (_id) => () => FlowRouter.go(FlowRouter.path('board', { _id }));

/**
 * Navigate to a product
 * @param  {String} _id the productID
 */
export const navigateToProduct = (_id) => () => FlowRouter.go(FlowRouter.path('product', { _id }));

/**
 * Format in USD TODO: add l18n support
 * @param  {Number} num the dollar amount unformatted
 * @return {String}     the formatted dollar amount
 */
const formatCurrency = (num) => `$${num.toFixed(2).replace(/(\d)(?=(\d\d\d)+(?!\d))/g, '$1,')}`;

/**
 * Calculates the number of images that can be in the row
 * @param  {Array} images the array of images
 * @return {Number}       the count of images
 */
const maxImages = (images) => images.length > 5 && 5 || images.length;

/**
 * Calculate the size of an image based on the containers width
 * @param  {Number} width the containers width
 * @return {Object}       the width an dheight
 */
const calcDimensions = (width) => {
  // With 4 items and 1% margin between, we
  // have a total of 6% less width
  // Subtract 1 for rounding error
  const w = (width - (width * 0.06) - 1) / 4;
  return {
    width: w,
    height: w < 75 ? w : 75,
  };
};

// the outer part of a card
export const HeroCard = ({ status, children }) => (
  <div className={`mavenx-card card ${!status && 'unlocked' || ''}`}>
    {children}
  </div>
);

HeroCard.propTypes = {
  status: PropTypes.number,
  children: PropTypes.any,
};

// the user info containing the user name, image and possible subtext
export const UserInfo = ({ image, username, subtext, favoritedCount, onClick }) => (
  <div className="user-info-block" onClick={onClick}>
    <Img
      src={image}
      alt={username}
      className="user-image"
      circle
    />
    <ul>
      <li className="username clamp clamp-1">{username}</li>
      {
        subtext &&
          <li className="sub-text">
            <span className="clamp clamp-1">{subtext}</span>
          </li>
      }
      {
        typeof favoritedCount !== 'undefined' &&
          <Counts favorites={favoritedCount} />
      }
    </ul>
  </div>
);

UserInfo.propTypes = {
  image: PropTypes.string,
  username: PropTypes.string,
  subtext: PropTypes.string,
  favoritedCount: PropTypes.number,
  onClick: PropTypes.func,
};

// a single image thumbnail with a set width and height
export const Thumbnail = ({ image, width, height }) => (
  <Img src={image.href} className="thumb" height={height} width={width} cover />
);

Thumbnail.propTypes = {
  image: PropTypes.object.isRequired,
  width: PropTypes.number.isRequired,
  height: PropTypes.number.isRequired,
};

// the container for the thumbnails
// eslint-disable-next-line react/prefer-stateless-function
export class Thumbnails extends React.Component {
  render() {
    const { containerWidth, images } = this.props;
    const thumbs = (!images || images.length <= 1) ?
      [{ href: ' ' }] :
      images.slice(1, maxImages(images));

    const dim = calcDimensions(containerWidth);

    return (
      <div className="thumbs" style={{ height: `${dim.height} !important` }}>
        {
          thumbs.map((thumb, index) => (
            thumb && <Thumbnail image={thumb} key={index} {...dim} />
          ))
        }
      </div>
    );
  }
}

Thumbnails.propTypes = {
  containerWidth: PropTypes.number.isRequired,
  images: PropTypes.array.isRequired,
};

// users the dimensions package to track window size changes and get the width of the container
export const ResponsiveThumbs = dimensions({ containerStyle: { height: 'auto' } })(Thumbnails);

export const Carousel = ({ images, alt }) => {
  if (!images || !images.length) {
    return <div className="img-container" />;
  }

  return (
    <div
      className={`img-container ${images.length === 1 && 'single-image' || ''}`}
    >
      {
        images.length > 1 && (
          <RawCarousel maxIndicatorCount={3}>
            {
              images.map((image, key) => (
                image && <Img src={image.href} key={key} role="presentation" alt={alt} />
              ))
            }
          </RawCarousel>
        ) || (
          images[0] && <Img src={images[0].href} role="presentation" />
        )
      }
    </div>
  );
};

Carousel.propTypes = {
  images: PropTypes.array,
  alt: PropTypes.string,
};

export const Details = ({ children, onClick }) => (
  <div className="details" onClick={onClick}>
    {children}
  </div>
);

Details.propTypes = {
  children: PropTypes.node.isRequired,
  onClick: PropTypes.func,
};


export const Title = ({ title }) => (
  <div className="title-container">
    <p className="title clamp clamp-2">{title}</p>
  </div>
);

Title.propTypes = {
  title: PropTypes.node.isRequired,
};
