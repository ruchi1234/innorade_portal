import React from 'react';

const Favorites = ({ favorites, className }) =>
  <span className={`favorites-count ${className}`}>
    <span aria-hidden="true" className="glyphicon glyphicon-heart">
      {favorites}
    </span>
  </span>;

Favorites.propTypes = {
  favorites: React.PropTypes.number.isRequired,
  className: React.PropTypes.string,
};


export default Favorites;
