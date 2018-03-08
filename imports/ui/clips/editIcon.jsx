import React from 'react';
import Popover from '/imports/ui/components/popover';

export default class Edit extends React.Component {
  constructor() {
    super();

    this.show = this.show.bind(this);
  }

  onShow(e) {
    e.preventDefault();

    this.show();
  }

  show() {
    this.refs.editPopover.show();
  }

  render() {
    const {
      popover,
    } = this.props;

    return (<Popover ref="editPopover" body={popover} />);
  }
}

Edit.propTypes = {
  popover: React.PropTypes.node.isRequired,
};
