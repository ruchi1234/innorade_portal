import React, { PropTypes } from 'react';
import { StyleSheet, css } from 'aphrodite';
import { wildSand, iron, turquoise, edward, quicksand } from '../style.js';
import formatMoney from '../../lib/formatMoney';
import { space } from '/imports/ui/style';

const styles = StyleSheet.create({
  toolbar: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    height: '61px',
    backgroundColor: wildSand,
    borderTop: `1px solid ${iron}`,
    padding: '15px',
    boxSizing: 'border-box',
  },
});

export const Toolbar = ({ children }) => (
  <div className={css(styles.toolbar)}>
    {children}
  </div>
);

Toolbar.propTypes = {
  children: PropTypes.node,
};


/*
 * Count bar styling
 */
const countStyle = StyleSheet.create({
  counts: {
    display: 'flex',
    alignItems: 'center',
    listStyleType: 'none',
    paddingLeft: '0',
    marginBottom: '0',
    fontSize: '14px',
    fontWeight: 'normal',
    height: '16px',
  },
  count: {
    display: 'flex',
    alignItems: 'center',
    color: edward,
    marginRight: '15px',
  },
  icon: {
    verticalAlign: 'center',

    '::before': {
      color: turquoise,
      paddingRight: '3px',
    },
  },

  price: {
    flexGrow: '1',
    fontFamily: quicksand,
    color: turquoise,
    fontSize: '18px',
    textAlign: 'right',
    marginRight: '0px',
    display: 'flex',
    justifyContent: 'flex-end',
  },
});

export const Counts = ({ clips, favorites, price }) => (
  <ul className={css(countStyle.counts)}>
    {
      typeof clips !== 'undefined' &&
        <li className={css(countStyle.count)}>
          <i
            aria-hidden="true"
            className={`glyphicon glyphicon-paperclip ${css(countStyle.icon)}`}
          >
          </i>
          <span className="count">{clips}</span>
        </li>
    }
    {
      typeof favorites !== 'undefined' &&
        <li className={css(countStyle.count)}>
          <i aria-hidden="true" className={`glyphicon glyphicon-heart ${css(countStyle.icon)}`}></i>
          <span className="count">{favorites}</span>
        </li>
    }
    {
      typeof price !== 'undefined' &&
        <li className={css(countStyle.count, countStyle.price)}>
          {price !== 0 && `$${formatMoney(price, 2)}` || ''}
        </li>
    }
  </ul>
);

Counts.propTypes = {
  clips: PropTypes.number,
  favorites: PropTypes.number,
  price: PropTypes.number,
};

const cardStyles = StyleSheet.create({
  card: {
    color: space,
    backgroundColor: 'white',
    overflow: 'hidden',
    maxHeight: '100%',
    boxShadow: '0 0 5px rgba(48, 57, 57, 0.65)',
  },
  fullPage: {
    width: '100%',
    maxWidth: '100%',
    overflow: 'hidden',
    height: 'calc(100vh - 30px)',
    maxHeight: 'calc(100vh - 30px)',
    marginTop: '15px',
    position: 'relative',
  },
  noUnderline: {
    ':hover': {
      textDecoration: 'none',
    },
  },
});

export const Card = ({ fullPage, children, href, onClick }) => {
  const content = (
    <div className={css(cardStyles.card, fullPage && cardStyles.fullPage)}>
      {children}
    </div>
  );

  return (href || onClick) ?
    <a href={href} onClick={onClick} className={css(cardStyles.noUnderline)}>{content}</a> :
    content;
};

Card.propTypes = {
  href: PropTypes.string,
  onClick: PropTypes.func,
  fullPage: PropTypes.bool,
  children: PropTypes.node.isRequired,
};
