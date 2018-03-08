import React from 'react';

const Brick = (props) => (
  <div className="brick">
    {props.children}
  </div>
);

Brick.propTypes = {
  children: React.PropTypes.node,
};

export default Brick;
