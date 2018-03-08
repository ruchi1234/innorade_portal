import React from 'react';

const ModalActions = ({ actions }) => (
  <div className="actions">
    {actions.map((a) => (
      <button
        className="btn btn-custom"
        onClick={a.action}
        disabled={a.disabled}
        key={a.label}
      >
        {a.label}
      </button>
    ))}
  </div>
);

ModalActions.propTypes = {
  actions: React.PropTypes.arrayOf(
    React.PropTypes.shape({
      label: React.PropTypes.node.isRequired,
      action: React.PropTypes.func.isRequired,
    })
  ),
};

export default ModalActions;
