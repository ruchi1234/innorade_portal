import React from 'react';
import { StyleSheet, css } from 'aphrodite';



export default ({ srcFunc, defaultSize = 28 }) => {
  const styles = StyleSheet.create({
    icon: {
      flexShrink: 0,
      display: 'inline-block',
      backgroundRepeat: 'no-repeat',
      backgroundPosition: 'center',
      backgroundImage: `none, url("data:image/svg+xml,${encodeURIComponent(srcFunc({ active: false, hover: false }))}")`,
    },

    active: {
      backgroundImage: `none, url("data:image/svg+xml,${encodeURIComponent(srcFunc({ active: true, hover: false }))}")`,
    },

    x2: {
      height: `${defaultSize * 2}px`,
      width: `${defaultSize * 2}px`,
      flexBasis: `${defaultSize * 2}px`,
    },

    x3: {
      height: `${defaultSize * 2.67}px`,
      width: `${defaultSize * 2.67}px`,
      flexBasis: `${defaultSize * 2.67}px`,
    },

    clickable: {
      cursor: 'pointer',
    },

    defaultSize: {
      height: `${defaultSize}px`,
      width: `${defaultSize}px`,
      flexBasis: `${defaultSize}px`,
    },

    white: {
      backgroundImage: `none, url("data:image/svg+xml,${encodeURIComponent(srcFunc({ fill: '#fff', active: false, hover: false }))}")`,
    },

    hover: {
      ':hover': {
        backgroundImage: `none, url("data:image/svg+xml,${encodeURIComponent(srcFunc({ active: false, hover: true }))}")`,
      },
    },
  });

  /*
   * Please don't ever sacrifice readability for 'performance'
   *
   * Only argument I can see for inlining a fucknig svg (unless you need to generate on the fly
   */

  return ({ onClick, active, x2, x3, srcFunc, white, classes, size, children }) => {
    const classStyles = [
      styles.icon,

      !size && styles.defaultSize,
      white && styles.white,
      (!white && active) && styles.active,
      (!active && !white && onClick) && styles.hover,

      x2 && styles.x2,
      x3 && styles.x3,
      onClick && styles.clickable,
      ...(classes || []),
    ];


    // Set the color
    const style = {};

    if (size) {
      style.height = `${size}px`;
      style.width = `${size}px`;
      style.flexBasis = `${size}px`;
    }

    return (
      <div
        style={style}
        onClick={onClick}
        className={css(...classStyles)}
      >
        {children}
      </div>
    );
  };
};
