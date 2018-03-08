import React from 'react';
import Popover from '/imports/ui/components/popover';

export default class Add extends React.Component {
  constructor() {
    super();

    this.show = this.show.bind(this);
  }

  onShow(e) {
    e.preventDefault();

    this.show();
  }

  show() {
    this.refs.addPopover.show();
  }

  render() {
    const {
      popover,
    } = this.props;

    return (<Popover ref="addPopover" body={popover} />);
  }
}

Add.propTypes = {
  popover: React.PropTypes.node.isRequired,
};
