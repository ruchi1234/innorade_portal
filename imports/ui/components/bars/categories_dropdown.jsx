import React, { PropTypes } from 'react';
import { composeWithTracker } from 'react-komposer';
import { FlowRouter } from 'meteor/kadira:flow-router';
import { _ } from 'meteor/underscore';

import Categories from '/imports/modules/categories/collection.js';
import Subscriptions from '/imports/data/subscriptions';

const Item = ({ category }) => (
  <li className={category.active && 'active'}>
    <a href={category.path}>
      {category.label}
    </a>
  </li>
);

Item.propTypes = {
  category: PropTypes.object,
};

const List = ({ categories }) => (
  <ul role="menu" className="dropdown-menu">
    {_.map(categories, c => <Item category={c} key={c.label} />) }
  </ul>
);

List.propTypes = {
  categories: PropTypes.arrayOf(PropTypes.object),
};

const categoryPath = (category) => {
  const current = FlowRouter.current();
  return FlowRouter.path('products', current.params, _.extend({}, current.queryParams, { category: category && encodeURIComponent(category) }));
};

export default composeWithTracker((props, onData) => {
  Subscriptions.subscribe('categories');
  const categories = Categories.find({}, { sort: { order: 1 } }).map(c => ({
    label: c.title,
    path: categoryPath(c.title),
    active: (c.title === FlowRouter.getQueryParam('category')),
  }));

  categories.unshift({ label: 'All Categories', path: categoryPath(undefined), active: !FlowRouter.getQueryParam('category') });

  onData(null, { categories });
})(List);
