import React from 'react';
import { css, StyleSheet } from 'aphrodite';
import numeral from 'numeral';

import Img from '../components/img.jsx';
import {
  reset,
  scampi,
  mineshaft,
  turquoise,
  mobileOnly,
  iron,
  lightGrey,
} from '../style.js';

/*
 * Profile Show component
 * img - User avatar
 * title -
 * favortedCount - Number of times their profile has been liked.
 * clipsCount - Total number of clips owned
 * description - Their description.
 * toolbar - Node that goes at the bottom. Will likely contain favorite btn,
 *   edit and share popovers.
 * retailerUrl - Url of their retailer if they have one
 * blogUrl- Url of blog if they have one.
 * facebookUrl - Url of facebook if connected.
 * twitterUrl - ''
 * pinterestUrl - ''
 * instagramUrl - ''
 */

const Social = ({ children, count, url, style }) => (
  <a className={css(styles.social, styles.linkIcon, style, !url && styles.hidden)} href={url} target="_blank" rel="noopener noreferrer">
    {children}
    {count ? numeral(count).format('0a') : '0'}
  </a>
);

const Site = ({ children, url, style }) => (
  <a className={css(styles.social, styles.linkIcon, style, !url && styles.hidden)} href={url} rel="noopener noreferrer" target="_blank">
    {children}
  </a>
);

export default ({
  ready,
  img,
  title,
  bio,
  description,
  boardCount,
  clipCount,
  favoritedCount,
  blogUrl,
  retailerUrl,
  facebookUrl,
  facebookCount,
  twitterUrl,
  twitterCount,
  pinterestUrl,
  pinterestCount,
  instagramUrl,
  instagramCount,
  counts,
  toolbar,
}) => (
  <div className={css(styles.profileShow)}>
    <Img
      src={img}
      circle
      cover
      height={150}
      width={150}
    />

    <h2 className={css(styles.title)}>
      {title}
    </h2>

    <ul className={css(styles.counts)}>
      <li className={css(styles.icon)}>
        <i
          aria-hidden="true"
          className={`fa fa-heart ${css(styles.countIcon)}`}
        ></i>
        <span>&nbsp;{favoritedCount || 0}</span>
      </li>
      <li className={css(styles.icon)}>
        <i
          aria-hidden="true"
          className={`fa fa-clone ${css(styles.countIcon)}`}
        ></i>
        <span >&nbsp;{boardCount || 0}</span>
      </li>
      <li className={css(styles.icon)}>
        <i
          aria-hidden="true"
          className={`fa fa-paperclip ${css(styles.countIcon)}`}
        ></i>
        <span>&nbsp;{clipCount || 0}</span>
      </li>
    </ul>

    <p className={css(styles.description)}>
      {bio}
    </p>

    <div className={css(styles.links, !(retailerUrl || blogUrl || facebookUrl || pinterestUrl || instagramUrl || twitterUrl) && styles.hidden )}>
      <div className={css(styles.visit)}>
        <div className={css(styles.sepWrap)}>
          <hr className={css(styles.linkSep)} />
        </div>
        <p className={css(styles.visitText)}>
          Visit
        </p>
        <div className={css(styles.sepWrap)}>
          <hr className={css(styles.linkSep)} />
        </div>
      </div>
      {
        (retailerUrl || blogUrl) && (
          <div className={css(styles.row, styles.spaceAround)}>
            <Site url={retailerUrl} style={styles.blog}>
              <i className="fa fa-shopping-cart fa-3x" aria-hidden="true"></i>
            </Site>
            <Site url={blogUrl} style={styles.blog}>
              <i className="fa fa-commenting-o fa-3x" aria-hidden="true"></i>
            </Site>
          </div>
        )
      }
      { ((retailerUrl || blogUrl) && (facebookUrl || pinterestUrl || twitterUrl || instagramUrl)) && <hr className={css(styles.linkSep)} /> }
      <div className={css(styles.row, styles.socialRow)}>
        <Social count={facebookCount} url={facebookUrl} style={styles.facebook}>
          <i className="fa fa-facebook fa-2x" aria-hidden="true"></i>
        </Social>
        <Social count={pinterestCount} url={pinterestUrl} style={styles.pinterest}>
          <i className="fa fa-pinterest fa-2x" aria-hidden="true"></i>
        </Social>
        <Social count={twitterCount} url={twitterUrl} style={styles.twitter}>
          <i className="fa fa-twitter fa-2x" aria-hidden="true"></i>
        </Social>
        <Social count={instagramCount} url={instagramUrl} style={styles.instagram}>
          <i className="fa fa-instagram fa-2x" aria-hidden="true"></i>
        </Social>
      </div>
    </div>

    <hr className={css(styles.hr)} />

    {toolbar}
  </div>
);

const styles = StyleSheet.create({
  profileShow: {
    ...reset,
    position: 'relative',
    display: 'flex',
    flexDirection: 'column',
    width: '100%',
    alignItems: 'center',
    maxWidth: '728px',
    marginLeft: 'auto',
    marginRight: 'auto',
    marginBottom: '24px',
  },
  row: {
    display: 'flex',
    justifyContent: 'space-between',
    width: '100%',
  },
  spaceAround: {
    justifyContent: 'space-around',
  },
  title: {
    color: mineshaft,
    minHeight: '33px',
  },
  description: {
    textAlign: 'center',
    maxWidth: '600px',
    flexShrink: 0,
  },

  hr: {
    flexShrink: 0,
    width: '100%',
    border: 0,
    height: 0,
    marginTop: '0px',
    borderTop: '1px solid rgba(0, 0, 0, 0.1)',
    borderBottom: `1px solid ${lightGrey}`,
  },

  counts: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    listStyleType: 'none',
    paddingLeft: 0,
    fontSize: '18px',
    width: '200px',
    flexBasis: '28px',
    color: iron,
    marginTop: '12px',
    marginBottom: '12px',
    flexShrink: 0,
  },

  countIcon: {
    color: turquoise,
  },

  visit: {
    display: 'flex',
    width: '100%',
    justifyContent: 'stretch',
    alignItems: 'center',
  },

  visitText: {
    paddingLeft: '12px',
    paddingRight: '12px',
    margin: '0px',
  },

  links: {
    position: 'absolute',
    top: 0,
    right: 0,
    width: '150px',
    padding: '12px',
    marginTop: '24px',
    marginBottom: '24px',
    flexShrink: 0,
    ...mobileOnly({
      position: 'relative',
    }),
  },

  linkSep: {
    marginTop: '12px',
    marginBottom: '12px',
  },

  sepWrap: {
    width: '100%',
  },

  linkIcon: {
    color: iron,
    textDecoration: 'none',
    cursor: 'pointer',
    ':hover': {
      color: scampi,
    },
  },

  socialRow: {
    justifyContent: 'space-around',
  },
  social: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    color: iron,
    fontSize: '12px',
  },
  iconLg: {
    fontSize: '24px',
  },
  disabledIcon: {
    cursor: 'auto',
    ':hover': {
      color: iron,
    },
  },
  hidden: {
    display: 'none',
    position: 'absolute',
  },
});
