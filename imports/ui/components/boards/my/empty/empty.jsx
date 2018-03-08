import React from 'react';
import { StyleSheet, css } from 'aphrodite';

import { raleway } from '../../../../style.js';
import Img from '../../../img.jsx';


const bStyles = StyleSheet.create({
  button: {
    cursor: 'pointer',
    fontFamily: raleway,
    paddingLeft: '24px',
    paddingRight: '24px',
    border: 'none',
    height: '50px',
    transition: 'background-color 0.5s ease',
    color: 'white',

    fontSize: '20px',
    lineHeight: '20px',
  },
  // Call to action / Not orange.
  // When naming, describe what it is, not how it should look
  //
  // Similarly, use props like showX instead of isClip for components that
  // aren't specifically a clip or board component
  callToAction: {
    textTransform: 'uppercase',
    fontWeight: '700',
    border: '1px solid #ccc',
    backgroundColor: '#ff8b00',
    ':hover': {
      backgroundColor: '#ee6900',
    },
  },
  primary: {},
  secondary: {},
  lg: {
    width: '400px',
    maxWidth: '100%',
  },
  sm: {},
});

/**
 * Would be it's own component
 */
const Button = ({ children, callToAction, lg, onClick }) => {
  let classNames = css(bStyles.button);
  if (callToAction) {
    classNames += ` ${css(bStyles.callToAction)}`;
  }

  if (lg) {
    classNames += ` ${css(bStyles.lg)}`;
  }

  return (
    <button
      className={`${classNames}`}
      onClick={onClick}
    >
      {children}
    </button>
  );
};

const styles = StyleSheet.create({
  root: {
    fontSize: '20px',
  },
  p: {
    paddingBottom: '24px',
    paddingLeft: '12px',
    paddingRight: '12px',
    fontFamily: raleway,
    textAlign: 'center',
    lineHeight: '1.2em',
    maxWidth: '800px',
    marginLeft: 'auto',
    marginRight: 'auto',
  },
  items: {
    display: 'flex',
    justifyContent: 'space-around',
    maxWidth: '100%',
    '@media (max-width: 900px)': {
      flexDirection: 'column',
      alignItems: 'center',
    },
  },
  item: {
    position: 'relative',
    flexBasis: '0px',
    flexShrink: 1,
    flexGrow: 1,
    textAlign: 'center',
    padding: '24px',
    maxWidth: '300px',
    display: 'flex',
    flexDirection: 'column',
    '@media (max-width: 900px)': {
      flexBasis: 'auto',
    },
  },
  itemTitle: {
    fontSize: '40px',
    marginTop: '24px',
    marginBottom: '12px',
    color: 'rgb(101, 99, 164)',
  },
  itemDesc: {
    lineHeight: '1.2em',
    marginTop: '12px',
    marginBottom: '12px',
  },
});

export default () => (
  <div className={css(styles.root)}>
    <p className={css(styles.p)}>
      At Maven, you earn by sharing products you love with your friends and followers. How?
    </p>

    <div className={css(styles.items)}>
      <div className={css(styles.item)}>
        <Img src="/img/clip.png" x3 />
        <h4 className={css(styles.itemTitle)}>
          1. Clip
        </h4>
        <p className={css(styles.itemDesc)}>
          Clip products from retailers’ sites onto boards at Maven.
        </p>
      </div>
      <div className={css(styles.item)}>
        <Img src="/img/share.png" x3 />
        <h4 className={css(styles.itemTitle)}>
          2. Share
        </h4>
        <p className={css(styles.itemDesc)}>
          Share your boards on Facebook, Pinterest, Twitter, Email, or your blog.
        </p>
      </div>
      <div className={css(styles.item)}>
        <Img src="/img/earn.png" x3 />
        <h4 className={css(styles.itemTitle)}>
          3. Earn
        </h4>
        <p className={css(styles.itemDesc)}>
          Earn commissions whenever a friend or follower clicks and buys.
        </p>
      </div>
    </div>

    <p className={css(styles.p)}>
      It’s easy!  Tap the “Build a Board” button above to create your first board.
    </p>
  </div>
);
