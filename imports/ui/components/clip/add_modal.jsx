/* global utu */
import React from 'react';
import { Meteor } from 'meteor/meteor';
import { openModal, closeModal } from '/imports/data/modal';
import { Header, Body, Actions, Content } from '/imports/ui/components/modal';

import Loader from '/imports/ui/components/loader';
import ImageArraySort from '/imports/ui/components/image/image_array_sort';
import ImageAdd from '/imports/ui/components/image/image_add';
import { Kadira } from 'meteor/meteorhacks:kadira';

import ProductWiz0 from '/imports/ui/components/products/modal/product_wiz0';
import ProductWiz1 from '/imports/ui/components/bproducts/edit_form';
import MaveletPubBoard from '/imports/ui/components/mavelet/mavelet_pub_board';
import MaveletConfirm from '/imports/ui/components/bproducts/add_multi_board_confirm';
import mixpanel from 'mixpanel-browser';

const AddModal = React.createClass({
  propTypes: {
    boardId: React.PropTypes.string,
  },

  getInitialState() {
    const { boardId } = this.props;
    return {
      newBoardPage: 0,
      pubBoards: [boardId],
      loading: false,
    };
  },

  onScrape(surl) {
    this.setState({
      loading: true,
    });
    this.setState({ modalLoadingCount: 1 });

    Meteor.call('scrapeTitleDescriptionImages', surl, (e, r) => {
      if (r) {
        const rprice = r.price || 0;
        this.setState({
          surl,
          description: r.description,
          domain: r.domain,
          images: r.images,
          title: r.title,
          url: r.url,
          aurlType: r.aurlType,
          price: parseFloat(Math.round(rprice * 100) / 100).toFixed(2),
          indix_mpid: r.indix_mpid,
          indix_categoryName: r.indix_categoryName,
          indix_upcs: [],
          indix_brandName: r.indix_brandName,
          indix_minSalePrice: r.indix_minSalePrice,
          indix_maxSalePrice: r.indix_maxSalePrice,
          indix_retailer: r.indix_retailer,
          indix_salePrice: r.price,
          indix_storeId: r.indix_storeId,
          loading: false,
          network: r.network,
          newBoardPage: 1,
          retailer: r.retailer,
          modalLoadingCount: 0,
        }, () => {
          this.saveProduct();
        });
      }
    });
  },

  onUpdateSortImages(images) {
    this.setState({
      images,
    });
  },

  onUpdateImages(image) {
    const { images } = this.state;
    const imgz = [
      image,
      ...images,
    ];
    // product.images = images;
    this.setState({
      images: imgz,
      newBoardPage: 2,
    });
  },

  moveBarImage(newIndex, oldIndex) {
    const { images } = this.state;
    const _images = images.slice(0);
    const myimage = _images.splice(oldIndex, 1);
    _images.splice(newIndex, 0, myimage[0]);
    this.setState({
      images: _images,
    });
  },

  removeBarImage(params) {
    const images = this.state.images;
    images.splice(params, 1);
    this.setState({
      images,
    });
  },

  setBoardPage(page) {
    this.setState({
      newBoardPage: page,
    });
  },

  showSort() {
    this.setState({
      newBoardPage: 2,
    });
  },

  editProduct(params) {
    this.setState({
      caption: params.caption,
      description: params.description,
      price: params.price,
      title: params.title,
    });
  },

  saveProduct() {
    const { boardId } = this.props;
    const currentUser = Meteor.user();
    const prod = {
      domain: this.state.domain,
      indix_mpid: this.state.indix_mpid || '',
      indix_brandName: this.state.indix_brandName || '',
      indix_categoryName: this.state.indix_categoryName || '',
      indix_minSalePrice: this.state.indix_minSalePrice || 0,
      indix_maxSalePrice: this.state.indix_maxSalePrice || 0,
      indix_retailer: this.state.indix_retailer || '',
      indix_salePrice: this.state.indix_salePrice || 0,
      indix_storeId: this.state.indix_storeId,
      indix_upcs: this.state.indix_upcs || [],
      network: this.state.network,
      price: this.state.price > 0 ? this.state.price : 0,
      retailer: this.state.retailer,
      title: this.state.title,  // keeping this on product - and regularly updating
      url: this.state.url,
      // aurlType: this.state.aurlType,
      userId: currentUser._id,
    };

    this.setState({ modalLoadingCount: 1 });
    Meteor.call('productUpsert', '', prod, (e, r) => {
      if (r) {
        this.setState({
          modalLoadingCount: 0,
          productId: r,
          newBoardPage: 1, // NOTE: move forward to edit...
        });
        mixpanel.track(`Added Prod from ${boardId ? 'Board' : 'My Products'}`, {
          userId: currentUser._id,
          productId: r,
          title: prod.title,
          price: prod.price,
          domain: prod.domain,
        });
        utu.track(`Added Prod from ${boardId ? 'Board' : 'My Products'}`, {
          userId: currentUser._id,
          productId: r,
          title: prod.title,
          price: prod.price,
          domain: prod.domain,
        });
      } else {
        if (e) {
          const type = 'saveProduct';
          const message = e.reason;
          Kadira.trackError(type, message);
        }
      }
    });
  },

  showLoader() {
    if (this.state.loading) {
      return (<Loader />);
    }
  },

  selectBoard(boardId) {
    let { pubBoards } = this.state;
    if (!_.contains(pubBoards, boardId)) {
      pubBoards = pubBoards.slice(0);
      pubBoards.push(boardId);
      this.setState({ pubBoards });
    }
  },

  deselectBoard(boardId) {
    let { pubBoards } = this.state;
    pubBoards = _.filter(pubBoards, (id) => {
      return (boardId !== id);
    });
    this.setState({ pubBoards });
  },

  clckPublish() {
    const { boardId } = this.props;
    const currentUser = Meteor.user();

    const prod = _.extend({
      caption: this.state.caption,
      description: this.state.description,
      domain: this.state.domain,
      images: this.state.images,
      network: this.state.network,
      price: this.state.price > 0 ? this.state.price : 0,
      retailer: this.state.retailer,
      title: this.state.title,
      url: this.state.url,
      surl: this.state.surl,
      aurlType: this.state.aurlType,
    }, this.state.clip);

    const pid = this.state.productId;

    // this.setState({
    //   newBoardPage: 5,
    // });
    this.state.pubBoards.forEach((bid) => {
      console.log('clip pub:', bid, pid, prod);
      if (bid) {
        Meteor.call('addProdToBoard', bid, pid, prod);
        mixpanel.track(`Added Clip from ${boardId ? 'Board' : 'My Products'}`, {
          boardId: bid,
          user: currentUser.username,
          userId: currentUser._id,
          productId: pid,
          title: prod.title,
          price: prod.price,
          domain: prod.domain,
        });
        utu.track(`Added Clip from ${boardId ? 'Board' : 'My Products'}`, {
          boardId: bid,
          user: currentUser.username,
          userId: currentUser._id,
          productId: pid,
          title: prod.title,
          price: prod.price,
          domain: prod.domain,
        });
      }
    });
  },

  modalContent() {
    const { images, newBoardPage, modalLoadingCount } = this.state;
    if (modalLoadingCount) { return <Loader />; }

    switch (newBoardPage) {
      case 0: { // enter url to scrape
        return (
          <ProductWiz0
            onScrape={this.onScrape}
            handleClose={closeModal}
          />
        );
      }
      case 1: { // edit
        return (this.state.loading ? <Loader /> :
          <ProductWiz1
            boardProduct={_.extend({}, this.state, this.state.clip)}
            ref="form"
            onSave={(c) => {
              this.setState(_.extend({
                clip: c,
                newBoardPage: 2,
              }, c));
            }}
          />
        );
      }
      case 2: { // manage images
        return (this.state.loading ? <Loader /> :
          <ImageArraySort
            images={images}
            onUpdateImages={this.onUpdateSortImages}
            returnImages={this.onUpdateSortImages}
            removeBarImage={this.removeBarImage}
            moveBarImage={this.moveBarImage}
          />
        );
      }
      case 3: { // add images
        return (this.state.loading ? <Loader /> :
          <ImageAdd
            images={images}
            handleAddImage={this.onUpdateImages}
            ref="imageGalleryModal"
            showSort={this.showSort}
          />
        );
      }
      case 4: { // publish
        return (this.state.loading ? <Loader /> :
          <MaveletPubBoard
            selectBoard={this.selectBoard}
            deselectBoard={this.deselectBoard}
            selectedBoards={this.state.pubBoards}
          />
        );
      }
      case 5: {
        return (this.state.loading ? <Loader /> :
          <MaveletConfirm
            pubBoards={this.state.pubBoards}
          />
        );
      }
      case 6: {
        return (this.state.loading ? <Loader /> :
          <div>
            <h4>
              Your product clipping has been created and added to the board.
            </h4>
          </div>
        );
      }
      default:
    }
  },

  modalFooter() {
    const { boardId } = this.props;
    const { newBoardPage } = this.state;
    switch (newBoardPage) {
      case 0: { // enter url to scrape
        return (<div></div>);
      }
      case 1: { // edit
        return (
          <Actions
            actions={[{
              label: 'Cancel',
              action: closeModal,
            }, {
              label: 'Next',
              action: (e) => this.refs.form.editProduct(e),
            }]}
          />
        );
      }
      case 2: { // manage images
        return (
          <Actions
            actions={[{
              label: 'Back',
              action: () => this.setBoardPage(1),
            }, {
              label: 'Add Image',
              action: () => this.setState({ newBoardPage: 3 }),
            }, {
              label: 'Next',
              action: () => {
                if (boardId) {
                  this.clckPublish();
                  this.setBoardPage(6);
                  // closeModal();
                } else {
                  this.setState({ newBoardPage: 4 });
                }
              },
            }]}
          />
        );
      }
      case 3: { // add images
        return (
          <Actions
            actions={[{
              label: 'Back',
              action: () => this.setBoardPage(2),
            }]}
          />
        );
      }
      case 4: { // publish
        return (
          <Actions
            actions={[{
              label: 'Prev',
              action: () => this.setBoardPage(2),
            }, {
              label: 'Next',
              action: () => {
                this.clckPublish();
                this.setBoardPage(5);
              },
              // action: this.clckPublish,
            }]}
          />
        );
      }
      case 5: { // multi-confirm
        return (
          <Actions
            actions={[{
              label: 'Done',
              action: closeModal,
            }]}
          />
        );
      }
      case 6: { // 1-confirm
        return (
          <Actions
            actions={[{
              label: 'Done',
              action: closeModal,
            }]}
          />
        );
      }
      default:
        return <span></span>;
    }
  },

  render() {
    return (
      <Content>
        <Header>
          <h2>Add Product Wizard</h2>
        </Header>
        <Body>
          {this.modalContent()}
        </Body>
        {this.modalFooter()}
      </Content>
    );
  },
});

export default (props) => openModal(<AddModal {...props} />);
