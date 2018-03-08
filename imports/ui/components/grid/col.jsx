import React from 'react';

const Col = React.createClass({
  propTypes: {
    children: React.PropTypes.node,
    xs: React.PropTypes.number,
    sm: React.PropTypes.number,
    md: React.PropTypes.number,
    lg: React.PropTypes.number,

    xsOffset: React.PropTypes.number,
    smOffset: React.PropTypes.number,
    mdOffset: React.PropTypes.number,
    lgOffset: React.PropTypes.number,

    xsHidden: React.PropTypes.bool,
    smHidden: React.PropTypes.bool,
    mdHidden: React.PropTypes.bool,
    lgHidden: React.PropTypes.bool,

    className: React.PropTypes.string,
  },

  render() {
    const { children,
        xs, sm, md, lg,
        xsOffset, smOffset, mdOffset, lgOffset,
        xsHidden, smHidden, mdHidden, lgHidden,
        className,
    } = this.props;

    const classes = ['col'];

    if (xs) { classes.push(`col-xs-${xs}`); }
    if (sm) { classes.push(`col-sm-${sm}`); }
    if (md) { classes.push(`col-md-${md}`); }
    if (lg) { classes.push(`col-lg-${lg}`); }

    if (xsOffset) { classes.push(`col-xs-offset-${xsOffset}`); }
    if (smOffset) { classes.push(`col-sm-offset-${smOffset}`); }
    if (mdOffset) { classes.push(`col-md-offset-${mdOffset}`); }
    if (lgOffset) { classes.push(`col-lg-offset-${lgOffset}`); }

    if (xsHidden) { classes.push('hidden-xs'); }
    if (smHidden) { classes.push('hidden-sm'); }
    if (mdHidden) { classes.push('hidden-md'); }
    if (lgHidden) { classes.push('hidden-lg'); }

    if (className) { classes.push(className); }

    return (
      <div className={classes.join(' ')}>
        {children}
      </div>
    );
  },
});

export default Col;
