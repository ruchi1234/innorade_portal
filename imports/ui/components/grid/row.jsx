import React from 'react';

const Row = ({ children, className }) => (
  <div className={`row ${className}`}>
    {children}
  </div>
);

Row.propTypes = {
  className: React.PropTypes.string,
  children: React.PropTypes.node,
};

export default Row;
