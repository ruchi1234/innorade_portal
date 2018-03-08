import React from 'react';

const Count = ({ count, className }) =>
  <span className={`clips-count ${className}`}>
    <span aria-hidden="true" className="glyphicon glyphicon-paperclip">
     {count}
    </span>
  </span>;

Count.propTypes = {
  count: React.PropTypes.number.isRequired,
  className: React.PropTypes.string,
};


export default Count;
