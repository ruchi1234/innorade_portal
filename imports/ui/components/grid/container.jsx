import React from 'react';

const Container = ({ className, children }) => (
  <div className={`container ${className || ''}`}>
    {children}
  </div>
);

Container.propTypes = {
  className: React.PropTypes.string,
  children: React.PropTypes.node,
};

export default Container;
