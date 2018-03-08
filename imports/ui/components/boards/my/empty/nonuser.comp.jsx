import React, { PropTypes } from 'react';
import { StyleSheet, css } from 'aphrodite';

import { raleway, reset, mobileOnly, martinique } from '../../../../style.js';
import Img from '../../../img.jsx';
import Clip from '../../../../lib/icons/clip.jsx';
import Share from '../../../../lib/icons/share.jsx';

const fitParent = {
  position: 'absolute',
  top: 0,
  bottom: 0,
  right: 0,
  left: 0,
};

const bStyle = StyleSheet.create({
  button: {
    padding: '12px',
    paddingLeft: '36px',
    paddingRight: '36px',
    backgroundColor: '#6563a4',
    border: '0px',
    borderRadius: '5px',
    color: 'white',
    fontFamily: raleway,
    fontSize: '16px',
    textTransform: 'uppercase',
  },
});

const Button = ({ onClick }) => (
  <button className={css(bStyle.button)} onClick={onClick}>
    Build a board
  </button>
);

const styles = StyleSheet.create({
  root: {
    ...reset,
    position: 'relative',
    marginLeft: 'auto',
    marginRight: 'auto',
    marginTop: '-35px',
  },

  getStarted: {
    textAlign: 'center',
    color: 'white',
    backgroundColor: '#fd4270',
    fontFamily: raleway,
    padding: '24px',
    boxSizing: 'border-box',
    marginBottom: '36px',
    ...mobileOnly({
      marginBottom: '0px',
      flexBasis: '100%',
      flexShrink: 0,
    }),
  },

  getStartedText: {
    marginTop: 0,
    fontSize: '20px',
  },

  fg: {
    ...fitParent,
    zIndex: 1,
    paddingBottom: '24px',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'flex-end',
    width: '100%',
    ...mobileOnly({
      paddingBottom: '0px',
      bottom: 0,
    }),
  },

  header: {
    boxSizing: 'border-box',
    position: 'absolute',
    zIndex: '1',
    width: '100%',
    fontSize: '28px',
    fontFamily: raleway,
    fontWeight: 400,
    padding: '18px',
    textAlign: 'center',
    backgroundColor: 'rgba(255,255,255,0.3)',
    margin: '0px',
    color: martinique,
    ...mobileOnly({
      position: 'relative',
      backgroundColor: 'white',
      fontSize: '18px',
      padding: '12px',
    }),
  },

  panes: {
    display: 'flex',
    alignItems: 'flex-end',
    justifyContent: 'stretch',
    overflow: 'hidden',
    maxWidth: '100%',
    paddingBottom: '24px',
    flexShrink: 0,
    ...mobileOnly({
      padding: '0px',
      justifyContent: 'flex-end',
    }),
  },

  pane: {
    flexBasis: '0px',
    flexGrow: '1',
    fontFamily: raleway,
    textAlign: 'left',
    ...mobileOnly({
      backgroundColor: 'transparent',
      textAlign: 'center',
      flexDirection: 'column',
    }),
  },

  paneBg: {
    width: '80%',
    maxWidth: '100%',
    minWidth: '245px',
    fontWeight: 400,
    padding: '12px',
    height: '100px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255,255,255,0.65)',
    boxSizing: 'border-box',
    ...mobileOnly({
      backgroundColor: 'transparent',
      flexDirection: 'column',
      width: '100%',
      minWidth: '0px',
      height: 'auto',
    }),
  },

  paneHeader: {
    fontSize: '32px',
    fontWeight: '400',
    margin: '0px',
    color: martinique,
    ...mobileOnly({
      color: 'white',
      fontSize: '20px',
    }),
  },

  paneDesc: {
    margin: '0px',
    fontSize: '16px',
    lineHeight: '20px',
    color: martinique,
    ...mobileOnly({
      display: 'none',
    }),
  },

  sep: {
    borderRight: '4px solid #49d0bf',
    height: '90%',
    flexShrink: 0,
    marginRight: '12px',
    marginLeft: '12px',
    ...mobileOnly({
      display: 'none',
    }),
  },
  hSep: {
    display: 'none',
    borderTop: '4px solid #49d0bf',
    height: '4px',
    marginTop: '12px',
    marginBottom: '12px',
    width: '80%',
    ...mobileOnly({
      display: 'block',
    }),
  },

  mobileOnly: {
    display: 'none',
    ...mobileOnly({
      display: 'block',
    }),
  },

  mobileHidden: {
    display: 'block',
    ...mobileOnly({
      display: 'none',
    }),
  },

  login: {
    textAlign: 'center',
    fontFamily: raleway,
    padding: '12px',
  },
});

const PaneFg = ({ label, desc, Icon }) => (
  <div className={css(styles.pane)}>
    <div className={css(styles.paneBg)}>
      <Icon active white classes={[styles.mobileOnly]} size={36} />
      <Icon active classes={[styles.mobileHidden]} x2 />
      <div className={css(styles.sep)} />
      <div className={css(styles.hSep)} />
      <div>
        <h3 className={css(styles.paneHeader)}>
          {label}
        </h3>
        <p className={css(styles.paneDesc)}>
          {desc}
        </p>
      </div>
    </div>
  </div>
);

PaneFg.propTypes = {
  Icon: PropTypes.func.isRequired,
};

const Empty = ({ handleLogin, handleBuildBoard }) => (
  <div className={css(styles.root)}>
    <h2 className={css(styles.header)}>
      Earn thousands of dollars by sharing products you love
      with your friends and followers.
    </h2>

    <div style={{ position: 'relative' }}>
      <Img
        src="/img/components/my_board/desktop.png"
        fullWidth
        cover
        maxHeight="580px"
      />

      <div className={css(styles.fg)}>
        <div className={css(styles.panes)}>
          <PaneFg label="1. Clip" desc="your favorite products." Icon={Clip} />
          <PaneFg label="2. Share" desc="your clips with your network." Icon={Share} />
          <PaneFg label="3. Earn" desc="whenever a follower clicks &amp; buys." Icon={Share} />
        </div>
        <div className={css(styles.getStarted, styles.mobileHidden)}>
          <p className={css(styles.getStartedText)}>
            Get started by registering and creating your first board now.
          </p>
          <Button onClick={handleBuildBoard}>
            Build a board
          </Button>
        </div>
      </div>
    </div>
    <div className={css(styles.getStarted, styles.mobileOnly)}>
      <p className={css(styles.getStartedText)}>
        Get started by registering and creating your first board now.
      </p>
      <Button onClick={handleBuildBoard}>
        Build a board
      </Button>
    </div>
    <p className={css(styles.login)}>
      Already have an account at Maven? <a onClick={handleLogin}>Login</a>
    </p>
  </div>
);

Empty.propTypes = {
  handleLogin: PropTypes.func.isRequired,
  handleBuildBoard: PropTypes.func.isRequired,
};

export default Empty;
