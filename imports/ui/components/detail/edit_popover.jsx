import React from 'react';
import Popover from '../../lib/popover.jsx';
import EditIcon from '../../lib/icons/edit.jsx';

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
      children,
    } = this.props;

    return (<Popover ref="editPopover" body={popover} >
      <EditIcon onClick={() => this.refs.editPopover.show()}>
        {children}
      </EditIcon>
    </Popover>);
  }
}

Edit.propTypes = {
  popover: React.PropTypes.node.isRequired,
};
