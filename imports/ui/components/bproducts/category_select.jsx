import React from 'react';
import { composeWithTracker } from 'react-komposer';
import { FlowRouter } from 'meteor/kadira:flow-router';
import { _ } from 'meteor/underscore';

import Categories from '/imports/modules/categories/collection.js';
import Subscriptions from '/imports/data/subscriptions';

const Select = ({ categories, value, onChange }) =>
   (
     <div className="form-group">
       <label
         id="prod-category"
         htmlFor="prod-category"
       >
        Category
       </label>
       <select
         id="prod-category"
         type="text"
         placeholder="Pick a Category"
         className="form-control-custom form-control select-pita"
         value={value}
         onChange={onChange}
       >
         <option key="" />
         {
          _.map(categories, c =>
            <option key={c.order}>{c.label}</option>
          )
        }
       </select>
     </div>
  )
;

Select.propTypes = {
  value: React.PropTypes.string,
  onChange: React.PropTypes.func,
};

export default composeWithTracker((props, onData) => {
  Subscriptions.subscribe('categories');
  const categories = Categories.find({}, { sort: { order: 1 } }).map(c =>
     ({
       label: c.title,
       order: c.order,
     })
  );

  onData(null, { categories });
})(Select);
