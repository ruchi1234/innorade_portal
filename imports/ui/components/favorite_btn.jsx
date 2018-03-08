import React from 'react';

const FavoriteBtn = ({ active, toggle }) => (
  <li className={`favorite ${active ? 'active' : ''}`}>
    <a onClick={toggle} className="btn btn-icon">
      <span></span>
    </a>
  </li>
);

FavoriteBtn.propTypes = {
  active: React.PropTypes.bool,
  toggle: React.PropTypes.func,
};

FavoriteBtn.defaultProps = {
  toggle() {},
  active: false,
};

export default FavoriteBtn;
