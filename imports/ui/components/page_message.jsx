import React from 'react';

const PageMessage = ({ children }) => (
  children ?
    <div className="page-message">
      <div>{children}</div>
    </div> :
    <span></span>
);

PageMessage.propTypes = {
  children: React.PropTypes.node,
};

export default PageMessage;
