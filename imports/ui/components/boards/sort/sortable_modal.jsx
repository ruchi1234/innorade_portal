import React from 'react';

import Modal from '/imports/ui/components/modal/modal';
import ModalFooter from '/imports/ui/components/modal/modal_footer';
import ModalBody from '/imports/ui/components/modal/modal_body';
import ModalHeader from '/imports/ui/components/modal/modal_header';

import BoardProductsSortable from '/imports/ui/components/boards/sort/sortable';

const BoardProductsSortableModal = React.createClass({
  propTypes: {
    boardId: React.PropTypes.string.isRequired,
    onHide: React.PropTypes.func,
    onShow: React.PropTypes.func,
  },

  show() {
    this.refs.modal.show();
  },

  hide() {
    this.refs.modal.hide();
  },

  render() {
    const { boardId, onHide, onShow } = this.props;

    return (
      <Modal ref="modal" onHide={onHide} onShow={onShow} className="sortable-modal">
        <ModalHeader>
          <h2>Board Products</h2>
          <p>Drag to change order</p>
        </ModalHeader>
        <ModalBody className="no-scroll">
          <BoardProductsSortable boardId={boardId} key={boardId} />
        </ModalBody>
        <ModalFooter>
          <div className="myProductsFooter">
            <button
              type="button"
              className="btn-custom"
              data-dismiss="modal">
              Done
            </button>
          </div>
        </ModalFooter>
      </Modal>
    );
  },
});

export default BoardProductsSortableModal;
