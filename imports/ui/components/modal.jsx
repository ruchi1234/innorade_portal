import React from 'react';
import { composeWithTracker } from 'react-komposer';
import EventHorizon from 'meteor/patrickml:event-horizon';
import { closeModal } from '/imports/data/modal';

export const Header = ({ className }) => (
  <header className={`modal-header ${className}`}>
    <button
      type="button"
      className="close"
      data-dismiss="modal"
      aria-label="Close"
      onClick={closeModal}
    >
      <i className="ion-ios-close-empty" aria-hidden="true"></i>
    </button>
  </header>
);

Header.propTypes = {
  className: React.PropTypes.string,
  children: React.PropTypes.node,
};

export const Title = ({ children }) => (
  <header className="modal-title">
    <h2>{children}</h2>
  </header>
);

Title.propTypes = {
  className: React.PropTypes.string,
  children: React.PropTypes.node,
};

const Modal = ({ open, small, Component }) => (
  open && (
    <div
      className={`modal fade in eh-modal ${small ? 'small' : ''}`}
      tabIndex="-1"
      role="dialog"
      aria-labelledby="modal"
    >
      <div className="modal-dialog" role="document">
        {Component}
      </div>
      <div className="modal-overlay" onClick={closeModal} />
    </div>
  ) || (
    <span></span>
  )
);

export default composeWithTracker((props, onData) => {
  onData(null, EventHorizon.subscribe('modal'));
})(Modal);

export const Content = ({ children, className }) => (
  <div className={`modal-content ${className}`}>
    {children}
  </div>
);

Content.propTypes = {
  children: React.PropTypes.node.isRequired,
  className: React.PropTypes.string,
};

export const Body = ({ children }) => (
  <div className="modal-body">
    {children}
  </div>
);

Body.propTypes = {
  children: React.PropTypes.node.isRequired,
};

export const Actions = ({ actions }) => (
  <div className="modal-footer">
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
  </div>
);

Actions.propTypes = {
  actions: React.PropTypes.arrayOf(
    React.PropTypes.shape({
      label: React.PropTypes.node.isRequired,
      action: React.PropTypes.func.isRequired,
    })
  ),
};
