/* global utu */
import React from 'react';
import { Meteor } from 'meteor/meteor';
import { FlowRouter } from 'meteor/kadira:flow-router';
import { composeWithTracker } from 'react-komposer';

import Subscriptions from '/imports/data/subscriptions';
import BoardProducts from '/imports/modules/clips/collection';
import QuotesList from '/imports/ui/components/quotes/quotes_list';

import DetailHeader from '/imports/ui/components/detail/detail_header';
import Container from '/imports/ui/components/grid/container';
import Loader from '/imports/ui/components/loader';
import editClip from '/imports/ui/clips/editModal';
import ImageModal from '/imports/ui/components/image/image_modal';

import mixpanel from 'mixpanel-browser';

import updateDochead from '/imports/modules/update_dochead';
import loginState from '/imports/data/users/login_state';
import can from '/imports/modules/can/can';
import EditPopover from '/imports/ui/components/detail/edit_popover';

import FavoriteIcon from '../clips/favoriteIcon';
import ShareIcon from '../clips/shareIcon';
import ReclipIcon from '../clips/reclipIcon';
import FlagIcon from '../lib/icons/flag.jsx';

const setDochead = (_id, boardProduct) => {
  const { title, retailer } = (boardProduct || {});
  const opts = {};

  if (boardProduct) {
    opts.title = boardProduct.title;
    opts.price = boardProduct.price;
    opts.description = boardProduct.caption || boardProduct.description || 'Recommended';
    opts.image = boardProduct.getImage();
    opts.siteName = boardProduct.retailer;
    opts.url = FlowRouter.url('product', { _id });
    opts.keywords = `${title || ''} ${retailer || ''} Maven mavenx.com`;
  }
  opts.type = 'product';

  updateDochead(opts);
};

const updateClip = (clipId, params) => {
  Meteor.call('boardProducts.update', clipId, params, () => {
    mixpanel.track('Updated Clipping', {
      bproductId: clipId,
    });
    utu.track('Updated Clipping', {
      bproductId: clipId,
    });
  });
};

const removeClip = (clipId) => {
  window.history.back();
  Meteor.call('boardProducts.remove', clipId, (err) => {
    mixpanel.track('Deleted Clipping', {
      bproductId: clipId,
    });
    utu.track('Deleted Clipping', {
      bproductId: clipId,
    });
  });
};

const handleEditHOF = (clip) => () => editClip({
  boardProduct: clip,
  onSave: (params) => updateClip(clip._id, params),
  onRemove: () => removeClip(clip._id),
});

const BoardProductDetail = React.createClass({
  propTypes: {
    cleanup: React.PropTypes.func.isRequired,
    boardProduct: React.PropTypes.object,
    ready: React.PropTypes.bool.isRequired,
    bproductId: React.PropTypes.string.isRequired,
  },

  getInitialState() {
    return {
      showImageGallery: false,
    };
  },

  componentDidMount() {
    setDochead(this.props.bproductId, this.props.boardProduct);
  },

  componentWillUpdate() {
    this.props.cleanup();
  },

  componentDidUpdate() {
    setDochead(this.props.bproductId, this.props.boardProduct);
  },

  componentWillUnmount() {
    this.props.cleanup();
  },

  onEdit() {
    this.refs.bproductmodal.show();
  },

  onSortImages() {
    this.refs.sortImagesModal.show();
  },

  onShowImageGallery() {
    this.refs.imageGalleryModal.show();
  },

  onUpdateImages(images) {
    const { boardProduct } = this.props;
    this.updateBoardProduct(images);
    mixpanel.track('Product - Added Images', {
      bproductId: boardProduct._id,
    });
    utu.track('Product - Added Images', {
      bproductId: boardProduct._id,
    });
  },

  handleAddImage(image) {
    const { boardProduct } = this.props;
    BoardProducts.api.addImage.call({
      _id: boardProduct._id,
      image,
    });
  },

  render() {
    const { boardProduct, ready, bproductId, userId } = this.props;
    // Document wasn't found bounce them to boards browse page
    if (ready && !boardProduct) {
      Bert.alert('The page you requested is not available.  You are being redirected to product' +
      ' directory.', 'warning', 'fixed-top');
      FlowRouter.go('boards');
    }

    if (!ready || !boardProduct) {
      return (
        <article>
          <Loader />
        </article>
      );
    }

    const detail = {
      _id: boardProduct._id,
      aurl: boardProduct.aurl,
      aurlType: boardProduct.aurlType,
      boardId: boardProduct.boardId,
      caption: boardProduct.caption,
      description: boardProduct.description,
      faves: boardProduct.favoritedByIds && boardProduct.favoritedByIds.length,
      favorited: boardProduct && boardProduct.userFavorite(),
      hero: boardProduct.getImage(),
      images: boardProduct.images,
      price: boardProduct.price,
      retailer: boardProduct.retailer,
      status: boardProduct.status,
      title: boardProduct.title,
      type: boardProduct.type,
    };

    const editBtn = can.update.clip(userId, bproductId) ? (
      <EditPopover
        card={detail}
        popover={
          <ul className="nav nav-pills nav-stacked share-popover">
            <li>
              <a href="#" onClick={handleEditHOF(boardProduct)}>
                Edit
              </a>
            </li>
            <li>
              <a href="#" onClick={this.onSortImages}>
                Manage Images
              </a>
            </li>
          </ul>
        }
      />
    ) : undefined;

    const creator = boardProduct.getCreator();
    return (
      <article className="browse">
        <DetailHeader
          alwaysShowImages
          typeLabel="product"
          purchaseLink={boardProduct.aurl}
          detail={detail}
          sortImages={this.changeBoardProductImagesOrder}

          toolbarBtns={[
            <FavoriteIcon clipId={bproductId} />,
            <ShareIcon clipId={bproductId} preferPlace="below" />,
            editBtn,
            <ReclipIcon clipId={bproductId} />,
            <FlagIcon />,
          ]}

          creatorName={creator.username || ''}
          creatorImage={creator.getImage()}
          creatorId={creator.userId}
          creator={creator}
        />
        <div className="related">
          <Container>
            <QuotesList
              productId={boardProduct.productId}
              bproductId={bproductId}
            />
          </Container>
        </div>
        <ImageModal
          _id={bproductId}
          doc={boardProduct}
          images={boardProduct.images || []}
          handleAddImage={this.handleAddImage}
          onUpdateImages={this.onUpdateImages}
          ref="sortImagesModal"
        />
      </article>
    );
  },
});

const BoardProductDetailWData = composeWithTracker(loginState)(MeteorData(BoardProductDetail, {
  getData(props) {
    const sub = Subscriptions.subscribe('boardProducts/byId', props.bproductId);
    const boardProduct = BoardProducts.findOne(props.bproductId);

    if (sub.ready() && !boardProduct) {
      console.error(`Clip ${props.bproductId} not found`);
    }

    return {
      boardProduct,
      ready: sub.ready(),
      cleanup() {
        sub.stop();
      },
    };
  },
}));

export default BoardProductDetailWData;
