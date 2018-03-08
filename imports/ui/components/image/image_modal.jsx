import React from 'react';
import Modal from '/imports/ui/components/modal/modal';
import ModalBody from '/imports/ui/components/modal/modal_body';
import ModalFooter from '/imports/ui/components/modal/modal_footer';
import ModalHeader from '/imports/ui/components/modal/modal_header';
import ImageAdd from '/imports/ui/components/image/image_add';
import ImageSort from '/imports/ui/components/image/image_sort';

// import Subscriptions from '/imports/data/subscriptions';
// import Products from '/imports/modules/products/collection';

const ImageModal = React.createClass({
  propTypes: {
    _id: React.PropTypes.string.isRequired,
    doc: React.PropTypes.object,
    images: React.PropTypes.array,
    handleAddImage: React.PropTypes.func.isRequired,
    onHide: React.PropTypes.func,
    onShow: React.PropTypes.func,
  },

  getDefaultProps() {
    return {
      onHide() {},
      onShow() {},
    };
  },

  getInitialState() {
    return {
      modalType: 0,
    };
  },

  componentWillMount() {
    this.onHide = () => {
      this.props.onHide();
      this.setState(this.getInitialState());
    };
  },

  showImageGallery() {
    this.setState({ modalType: 1 });
  },

  showSort() {
    this.setState({ modalType: 0 });
  },

  show() {
    this.refs.modal.show();
  },

  hide() {
    this.refs.modal.hide();
  },

  modalContent() {
    const { _id, images, handleAddImage } = this.props;
    let { doc } = this.props;
    const { modalType } = this.state;

    switch (modalType) {
      case 0:  // sort
        return (
          <ImageSort
            _id={_id}
            doc={doc}
            key={_id}
          />
        );
      case 1:  // add images
        return (
          <ImageAdd
            images={images}
            handleAddImage={handleAddImage}
            ref="imageGalleryModal"
            showSort={this.showSort}
          />
        );
      default:
    }
  },

  render() {
    const { onShow } = this.props;
    const { modalType } = this.state;
    return (
      <Modal ref="modal" onHide={this.onHide} onShow={onShow}>
        <ModalHeader>
          <h2>Image Gallery</h2>
          <p>Tap and drag to change order</p>
        </ModalHeader>
        <ModalBody>
          {this.modalContent()}
        </ModalBody>
        <ModalFooter>
          {
            modalType === 0 ?
            (
              <div className="myProductsFooter">
                <button
                  type="button"
                  onClick={this.showImageGallery}
                  className="btn-custom"
                >
                  Add Image
                </button>
                <button
                  type="button"
                  className="btn-custom"
                  onClick={this.hide}
                >
                    Done
                </button>
              </div>
            ) : (
              <div className="myProductsFooter">
                <button
                  type="button"
                  className="btn-custom"
                  onClick={this.showSort}
                >
                  Cancel
                </button>
              </div>
            )
          }
        </ModalFooter>
      </Modal>
    );
  },
});

export default ImageModal;
