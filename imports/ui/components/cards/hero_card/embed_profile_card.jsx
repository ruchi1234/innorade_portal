import React, { Component, PropTypes } from 'react';
import { css, StyleSheet } from 'aphrodite';
import numeral from 'numeral';
import shallowCompare from 'react-addons-shallow-compare';
import { FlowRouter } from 'meteor/kadira:flow-router';
import { UserInfo, navigateToBoard, navigateToProduct } from './card';
import { Card, Counts } from '../../../lib/card';
// import canHOF from '/imports/modules/can/can_hof';
import mixpanel from 'mixpanel-browser';
import Img from '/imports/ui/components/img';

import {
  reset,
  turquoise,
  mobileOnly,
  iron,
  scampi,
  twitter,
  facebook,
  pinterest,
  instagram,
} from '../../../style.js';

export default class ProfileCard extends Component {
  shouldComponentUpdate(nextProps, nextState) {
    return shallowCompare(this, nextProps, nextState);
  }

  render() {
    const {
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
      slug,
    } = this.props;
    // const image = _.first(this.props.images);
    // const hideCreator = this.props.hideCreator;
    const handleOpen = () => {
      window.open(FlowRouter.url(`profile/${slug}`));
    };

    return (
      <Card fullPage onClick={handleOpen}>
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

          <div className={css(styles.hideOverflow)}>
            <p className={css(styles.description)}>
              {bio}
            </p>
          </div>
        </div>
      </Card>
    );
  }
}

ProfileCard.propTypes = {
  status: PropTypes.number,
  images: PropTypes.array,
  hideCreator: PropTypes.bool,
};

const styles = StyleSheet.create({
  profileShow: {
    ...reset,
    maxHeight: '100%',
    boxSizing: 'border-box',
    padding: '12px',
    position: 'relative',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  title: {
    fontSize: '18px',
  },
  row: {
    display: 'flex',
    justifyContent: 'space-between',
    width: '100%',
  },
  spaceAround: {
    justifyContent: 'space-around',
  },
  hideOverflow: {
    overflow: 'hidden',
  },
  description: {
    textAlign: 'center',
    maxWidth: '600px',
    fontSize: '12px',
  },

  counts: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    listStyleType: 'none',
    paddingLeft: 0,
    fontSize: '18px',
    width: '200px',
    color: iron,
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
    padding: '12px',
    margin: '0px',
  },

  links: {
    position: 'absolute',
    right: 0,
    width: '150px',
    padding: '12px',
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
    textUnderline: 'none',
    cursor: 'pointer',
    ':hover': {
      color: 'inherit',
    },
  },

  linkColor: {
    color: scampi,
  },

  social: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    color: iron,
    ':hover': {
      color: 'inherit',
    },
  },
  iconLg: {
    fontSize: '24px',
  },
  blog: {
    color: scampi,
  },
  facebook: {
    color: facebook,
  },
  pinterest: {
    color: pinterest,
  },
  instagram: {
    color: instagram,
  },
  twitter: {
    color: twitter,
  },
  disabledIcon: {
    color: iron,
    ':hover': {
      color: 'inherit',
    },
  },
});
