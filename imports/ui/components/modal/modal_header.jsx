import React from 'react';
import $ from 'jquery';

const ModalHeader = React.createClass({
  propTypes: {
    className: React.PropTypes.string,
    onShow: React.PropTypes.func,
    onHide: React.PropTypes.func,
  },

  getDefaultProps() {
    return {
      className: '',
      onHide() {},
    };
  },

  handleHide() {
    if (this.props.onHide()) {
      this.props.onHide();
    } else {
      $('.modal').modal('hide');
    }
  },

  render() {
    const { className } = this.props;
    return (
      <header className={`modal-header ${className}`}>
        <button
          type="button"
          className="close"
          data-dismiss="modal"
          aria-label="Close"
          onClick={this.handleHide}>
          <i className="ion-ios-close-empty" aria-hidden="true"></i>
        </button>
      </header>
    );
  },
});

export default ModalHeader;
