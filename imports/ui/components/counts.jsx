import React from 'react';

export default ({ clips, favorites, price }) => (
  <ul className="counts counts-common">
    {
      typeof clips !== 'undefined' &&
        <li className="attach">
          <i aria-hidden="true" className="glyphicon glyphicon-paperclip"></i>
          <span className="count">{clips}</span>
        </li>
    }
    {
      typeof favorites !== 'undefined' &&
        <li className="like">
          <i aria-hidden="true" className="glyphicon glyphicon-heart"></i>
          <span className="count">{favorites}</span>
        </li>
    }
    {
      typeof price !== 'undefined' &&
        <li className="price">
          {price > 0 && `$${price.formatMoney(2)}`}
        </li>
    }
  </ul>
);
