import React from 'react';

const Component = ({ onSend, onCancel }) => (
  <div className="actions">
    <button className="btn btn-custom" onClick={onCancel}>
      Cancel
    </button>
    <button className="btn btn-custom" onClick={onSend}>
      Send
    </button>
  </div>
);

Component.propTypes = {
  onSend: React.PropTypes.func.isRequired,
  onCancel: React.PropTypes.func.isRequired,
};

export default Component;
