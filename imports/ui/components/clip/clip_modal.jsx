import React from 'react';

import Modal from '/imports/ui/components/modal/modal';
import ModalFooter from '/imports/ui/components/modal/modal_footer';
import ModalBody from '/imports/ui/components/modal/modal_body';
import ModalHeader from '/imports/ui/components/modal/modal_header';

import ClipList from '/imports/ui/components/clip/clip_list';

const ClipModal = React.createClass({

  propTypes: {
    userId: React.PropTypes.string.isRequired,
    productId: React.PropTypes.string.isRequired,
  },

  onHide() {
    this.refs.modal.hide();
  },
  show() {
    this.refs.modal.show();
  },

  render() {
    const { userId, productId } = this.props;
    return (
      <Modal ref="modal">
        <ModalHeader />
        <ModalBody>
          <section className="clipModal">
            <h2 className="modal-title">
              My Re-Clips
            </h2>
            <ClipList
              userId={userId}
              productId={productId}
              key={userId}
            />
          </section>
        </ModalBody>
        {/*<ModalFooter>
          <div className="editProductFooter">
            <button
              type="button"
              className="btn btn-custom"
              data-dismiss="modal"
            >
                Next
            </button>
          </div>
        </ModalFooter>*/}
      </Modal>);
  },
});

export default ClipModal;
