import React from 'react';

const Component = ({ onCancel }) => (
  <div className="actions">
    <button className="btn btn-custom" onClick={onCancel}>
      Cancel
    </button>
  </div>
);

Component.propTypes = {
  onCancel: React.PropTypes.func.isRequired,
};

export default Component;
