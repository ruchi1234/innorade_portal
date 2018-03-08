import React from 'react';
import ReactPopover from 'react-popover';

export default Popover = React.createClass({
  propTypes: {
    children: React.PropTypes.node,
    body: React.PropTypes.node.isRequired,
  },

  getInitialState() {
    return {
      show: false,
    };
  },

  onClickHide(e) {
    e.preventDefault();
    this.hide();
  },

  onClickToggle(e) {
    e.preventDefault();
    this.toggle();
  },

  show() {
    this.setState({ show: true });
  },

  hide() {
    this.setState({ show: false });
  },

  toggle() {
    if (this.state.show) {
      this.hide();
    } else {
      this.show();
    }
  },

  render() {
    const { preferPlace } = this.props;
    const { show } = this.state;

    const body = (<div onClick={this.onClickHide} ref="bodyWrap">
      {this.props.body}
    </div>);

    return (
      <ReactPopover
        preferPlace={preferPlace || 'above'}
        isOpen={show}
        onOuterAction={this.hide}
        body={body}
      >
        <a onClick={this.onClickToggle} ref="link" className="btn btn-icon">
          {this.props.children}
        </a>
      </ReactPopover>
    );
  },
});
