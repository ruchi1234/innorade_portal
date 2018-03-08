import React from 'react';

const Component = ({ onDone }) => (
  <div className="actions">
    <button
      className="btn btn-custom"
      onClick={onDone}
    >
      Done
    </button>
  </div>
);

Component.propTypes = {
  onDone: React.PropTypes.func.isRequired,
};

export default Component;
