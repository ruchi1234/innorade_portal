import React, { PropTypes } from 'react';
import { StyleSheet, css } from 'aphrodite';
import { iron, space, wildSand, raleway } from '../../style';

export default ({ label, activeColor, icon }) => {
  const style = StyleSheet.create({
    wrap: {
      marginTop: '20px',
      marginBottom: '20px',
      display: 'flex',
    },
    row: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    btn: {
      paddingTop: '6px',
      cursor: 'pointer',
      border: 'none',
      backgroundColor: wildSand,
      color: space,
      fontFamily: raleway,
      minHeight: '50px',
      maxWidth: '100%',
      transition: 'background-color 0.5s ease',
      flexGrow: 1,
    },
    active: {
      backgroundColor: activeColor,
      color: wildSand,
      pointer: 'default',
    },
    iconWrap: {
      flexBasis: '40px',
      display: 'flex',
      justifyContent: 'center',
      fontSize: '20px',
    },
    content: {
      paddingRight: '20px',
    },
    labelWrap: {
      fontWeight: 'bold',
      fontSize: '18px',
    },
    cntrl: {
      cursor: 'pointer',
      color: iron,
      fontSize: '30px',
      verticalAlign: 'center',
      margin: '10px',
    },
    hide: {
      visibility: 'hidden',
    },
    url: {
      fontSize: '16px',
    },
  });

  const Btn = ({ connected, handleRemove, handleConnect, followerCount, friendCount, url }) => (
    <div className={css(style.wrap)}>
      <button
        className={css(style.btn, connected && style.active)}
        onClick={!connected && handleConnect}
      >
        <div className={css(style.row)}>
          <div className={css(style.iconWrap)}>
            {icon}
          </div>
          <div className={css(style.content)}>
            Connect{connected && 'ed'} with
            <span className={css(style.labelWrap)}>
              &nbsp;{label}
            </span>
          </div>
        </div>
        <div className={css(style.row)}>
          {connected && followerCount > 0 &&
            <span>
              Followers: {followerCount}
            </span>
          }
          {connected && friendCount > 0 &&
            <span>
              Friends: {friendCount}
            </span>
          }
        </div>
        {connected &&
          <a href={url} target="_blank" rel="noopener noreferrer" >
            <input
              value={url}
              className={css(style.url)}
              readOnly
            />
          </a>
        }
      </button>
      <i
        className={`fa fa-times ${css(style.cntrl, (!connected || !handleRemove) && style.hide)}`}
        onClick={handleRemove}
      />
    </div>
  );

  Btn.propTypes = {
    followerCount: PropTypes.number,
    friendCount: PropTypes.number,
    url: PropTypes.string,
    connected: PropTypes.bool,
    handleRemove: PropTypes.func,
    handleConnect: PropTypes.func,
  };

  return Btn;
};
