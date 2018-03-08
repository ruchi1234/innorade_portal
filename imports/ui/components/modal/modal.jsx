import React from 'react';
import { Tracker } from 'meteor/tracker';
import RenderInBody from '/imports/ui/components/render_in_body';

const Modal = React.createClass({
  propTypes: {
    onShow: React.PropTypes.func.isRequired,
    onHide: React.PropTypes.func.isRequired,
    children: React.PropTypes.node,
  },

  getDefaultProps() {
    return {
      onShow: () => {},
      onHide: () => {},
    };
  },

  getInitialState() {
    return { shown: false };
  },

  componentDidMount() {
    $(this.refs.modal).on('hidden.bs.modal', this.handleHide);
    $(this.refs.modal).on('shown.bs.modal', this.handleShow);
  },

  componentWillUnmount() {
    $(this.refs.modal).unbind('hidden.bs.modal', this.handleHide);
    $(this.refs.modal).unbind('shown.bs.modal', this.handleShow);
    this.hide();
  },

  show() {
    this.setState({ shown: true });
    $(this.refs.modal).modal('show');
  },

  handleShow() {
    this.setState({ shown: true });
    this.props.onShow();
  },

  hide() {
    $(this.refs.modal).modal('hide');
  },

  handleHide() {
    this.props.onHide();
    this.setState({ shown: false });
  },

  render() {
    const { className } = this.props;
    const { shown } = this.state;
    return (
      <RenderInBody>
        <div
          ref="modal"
          className={`modal fade in ${className}`}
          tabIndex="-1"
          role="dialog"
          aria-labelledby="myModal"
        >
          <div className="modal-dialog" role="document">
            <div className="modal-content">
              {shown && this.props.children}
            </div>
          </div>
        </div>
      </RenderInBody>
    );
  },
});

export default Modal;
