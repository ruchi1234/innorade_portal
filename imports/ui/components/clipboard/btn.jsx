/* global utu */
import React from 'react';
import Clipboard from 'clipboard';
import { Random } from 'meteor/random';
import openSafariCopy from '/imports/ui/components/clipboard/safari_modal';
import mixpanel from 'mixpanel-browser';
import { Meteor } from 'meteor/meteor';

class ClipBtn extends React.Component {
  constructor() {
    super();
    // Work around for clipboard library taking
    // a identifier
    this._id = `clip-btn-${Random.id()}`;
  }

  componentDidMount() {
    const { onSuccess, clipboardContent, type } = this.props;
    const cb = new Clipboard(`#${this._id}`); // eslint-disable-line no-new

    cb.on('success', () => {
      onSuccess();
    });

    cb.on('error', () => {
      openSafariCopy({ clipboardContent });
      mixpanel.track(`Copy ${type}`, {
        // url: clipboardContent,
        userId: Meteor.userId(),
      });
      utu.track(`Copy ${type}`, {
        // url: clipboardContent,
        userId: Meteor.userId(),
      });
    });
  }

  render() {
    const { className, children, clipboardContent, onClick } = this.props;

    return (
      <a
        className={className}
        id={this._id}
        data-clipboard-text={clipboardContent}
        onClick={onClick}
      >
        {children}
      </a>
    );
  }
}

ClipBtn.propTypes = {
  className: React.PropTypes.string,
  children: React.PropTypes.node.isRequired,
  clipboardContent: React.PropTypes.string.isRequired,
  onClick: React.PropTypes.func,
  onSuccess: React.PropTypes.func,
  type: React.PropTypes.string,
};

ClipBtn.defaultProps = {
  onSuccess: () => {},
  onClick: () => {},
};

export default ClipBtn;
