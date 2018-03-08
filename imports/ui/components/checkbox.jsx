import React from 'react';

const checked = (value) => value !== false && typeof value !== 'undefined';

export const CheckBox = ({ id, value, onClick, onChange}) => (
    <input
      id={id}
      type="checkbox"
      value={value}
      onClick={onClick}
      checked={checked(value)}
      onChange={onChange || function foo() {}}
    />
);

CheckBox.propTypes = {
  id: React.PropTypes.string,
  value: React.PropTypes.any,
  onClick: React.PropTypes.func,
  onChange: React.PropTypes.func,
  label: React.PropTypes.string,
};

export default CheckBox;
