import React from 'react';
import { StyleSheet, css } from 'aphrodite';
import _ from 'underscore';

const styles = StyleSheet.create({
  imgRoot: {
    position: 'relative',
    overflow: 'hidden',
    opacity: 1,
  },

  x1: {
    height: '0px',
    flexBasis: '60px',
  },

  x2: {
    height: '60px',
    flexBasis: '60px',
  },

  x3: {
    height: '80px',
    flexBasis: '80px',
  },

  circle: {
    flexBasis: '40px',
    flexShrink: '0',
    width: '40px',
    height: '40px',
  },

  fullWidth: {
    width: '100%',
  },

  fullWidthImage: {
    width: '100%',
  },

  // Pertains to the actual image div
  bg: {
    position: 'absolute',
    top: '0',
    bottom: '0',
    left: '0',
    right: '0',

    backgroundPosition: 'center center',
    backgroundSize: 'contain',
    backgroundRepeat: 'no-repeat',
  },

  bgCircle: {
    borderWidth: '500px',
    borderRadius: '100%',
    backgroundSize: 'cover',
  },

  bgCover: {
    backgroundSize: 'cover',
  },

  // Pertains to the hidden img tags
  hide: {
    visibility: 'hidden',
    flex: '1 0 100%',
    height: '100%',
    maxWidth: '100%',
    opacity: 1,
  },
});

// FIXME Hack around FISC with aprhodite
_.each(styles, (v) => css(v));


/**
 * Component handles images.
 * Will avoid screwing up aspect ratio while allowing flexible height's and width's.
 * Default's to 'contain' style, where image fit's fully within it's bounds.
 *
 *
 * @constructor
 * @param {string} src - Url of image.
 * @param {string} alt - Alt of image.
 * @param {bool} circle - Will display a circle version of image. Defaults to 40x40.
 * @param {bool} cover - Will change image to cover style, where image will always
 *   fully cover it's bounds.
 * @param {number} height - Height of image container.
 * @param {number} width - Height of image container.
 * @param {string} className - Standard classname field.
 *
 * Future:
 *   I think this would include a transform into a cloudinary request, as well
 *   as error detection for image load.  There may also be an option to add
 *   a fade in as well as a loading spinner.
 */
const Img = ({ src, className, circle, maxHeight, alt, height, width, cover, onClick, x2, x3, fullWidth }) => {
  const rootClassnames = css(
    circle && styles.circle,
    x2 && styles.x2,
    x3 && styles.x3,
    fullWidth && styles.fullWidth,
    styles.imgRoot
  );

  const bgClassnames = css(
    styles.bg,
    circle && styles.bgCircle,
    cover && styles.bgCover
  );

  const style = { };
  if (height || width) {
    style.minWidth = width;
    style.width = width;
    style.maxWidth = width;
    style.minHeight = height;
    style.height = height;
    style.maxHeight = height;
  }
  if (maxHeight) {
    style.maxHeight = maxHeight;
  } else {
    style.maxHeight = '100%';
  }

  const bgStyle = { backgroundImage: `url('${src}')` };

  return (
    <div
      className={`${className || ''} ${rootClassnames} image-container`}
      style={Object.assign(style, { opacity: 0 })}
      onClick={onClick}
    >
      {/* Always center in parent element and contain */}
      <div className={`image ${bgClassnames}`} style={bgStyle}>
        <img
          src={src}
          alt={alt}
          style={{ visibility: 'none' }}
          className={css(styles.hide)}
        />
      </div>

      {/* Handle sizing if not defined */}
      {!height &&
        <img
          src={src}
          alt={alt}
          style={{ visibility: 'none' }}
          className={css(styles.hide, fullWidth && styles.fullWidthImage)}
        />
      }
    </div>
  );
};

Img.propTypes = {
  src: React.PropTypes.string,
  className: React.PropTypes.string,
  circle: React.PropTypes.bool,
  alt: React.PropTypes.string,
  height: React.PropTypes.number,
  width: React.PropTypes.number,
  cover: React.PropTypes.bool,
  onClick: React.PropTypes.func,
};

export default Img;
