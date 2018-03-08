import React from 'react';
import { css, StyleSheet } from 'aphrodite';
import { mobileOnly } from '../style';

const styles = StyleSheet.create({
  wrap: {
    position: 'relative',
  },
  subtitle: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    right: 0,
    ...mobileOnly({ display: 'none' }),
  },
});

const Tabs = ({ children, subtitle }) => (
  <div className="nav-tabs">
    <ul className={`nav nav-tabs container ${css(styles.wrap)}`}>
      {children}
      <div className={css(styles.subtitle)} >
        {subtitle}
      </div>
    </ul>
  </div>
);

const Tab = ({ onClick, active, children }) => (
  <li
    role="presentation"
    className={(active) && 'active'}
    onClick={onClick}
  >
    {children}
  </li>
);

export { Tabs, Tab };
