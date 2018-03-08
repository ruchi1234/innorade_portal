/* global utu */
import React from 'react';
import { Meteor } from 'meteor/meteor';
import { extractDomain } from '/imports/modules/domain_utils';
import { _ } from 'meteor/underscore';
import { Kadira } from 'meteor/meteorhacks:kadira';
import { Session } from 'meteor/session';

import CanHOC from '/imports/ui/can_hoc';
import Loader from '/imports/ui/components/loader';

import MaveletAddProduct from '/imports/ui/components/mavelet/mavelet_add_product';
import MaveletPubBoard from '/imports/ui/components/mavelet/mavelet_pub_board';
import MaveletConfirm from '/imports/ui/components/bproducts/add_multi_board_confirm';
import ModalActions from '/imports/ui/components/modal/modal_actions';
import mixpanel from 'mixpanel-browser';

const Mavelet = React.createClass({

  // mixins: [ReactMeteorData],

  getInitialState() {
    console.log('Mavelet getInitialState >');

    let argsString = decodeURIComponent(window.location.href);
    if (Session.get('redirectAfterLogin')) {
      argsString = decodeURIComponent(Session.get('redirectAfterLogin'));
      Session.set('redirectAfterLogin', '');
      argsString = argsString.replace('/mavelet?args=', '');
      argsString = argsString.replace('#maveletCarousel', '');
    } else {
      let hname = `https://${window.location.hostname}`;
      hname = window.location.hostname === 'localhost' ? 'http://localhost:3000' : hname;
      console.log('hname: ', hname);
      argsString = argsString.replace(`${hname}/mavelet?args=`, '');
      argsString = argsString.replace('#maveletCarousel', '');
    }

    console.log('args_string:', argsString);
    const args = JSON.parse(argsString);

    const thumbs = typeof args.thumbed === 'string' && JSON.parse(args.thumbed)
      || args.thumbed;
    const images = thumbs.map((thumb) => ({
      // _id: Meteor.uuid(), // FIXME later comeback and change
      _id: Math.floor((Math.random() * 100000) + 1),
      href: thumb.src,
      source: 'mavelet',
    }));

    console.log(args.url);

    return {
      images,
      description: args.description || '',
      domain: extractDomain(args.url.href.indexOf('&') > 0 ?
        (args.url.href.split('&', 1)).toString() : args.url.href),
      imageCount: images.length,
      price: 0.00,
      productId: '',
      pubBoards: [],
      title: args.title || '',
      url: args.url.href.indexOf('&') > 0 ?
        (args.url.href.split('&', 1)).toString() : args.url.href,
      surl: args.url.href,
      userId: Meteor.userId(),

      indix_mpid: '',
      indix_categoryName: '',
      indix_upcs: [],
      indix_brandName: '',
      indix_minSalePrice: 0.00,
      indix_maxSalePrice: 0.00,
      indix_retailer: '',
      indix_salePrice: 0.00,
      indix_storeId: '',

      loadingCount: 0,
      viewState: 'product',
    };
  },

  componentWillMount() {
    this.setState({ loadingCount: 1 });

    Meteor.call('scrapeTitleDescription', this.state.url, (e, r) => {
      console.log('scrapeTitleDescription: ', r, e);
      if (r) {
        const rprice = r.price || 0;
        const description = r && r.description || this.state.description;
        const title = r && r.title || this.state.title;
        this.setState({
          description,
          domain: r.domain,
          // images: r.images,
          title,
          url: r.url,
          // surl: this.state.url
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
          loadingCount: 0,
          network: r.network,
          // newBoardPage: 1,
          retailer: r.retailer,
          aurlType: r.aurlType,
        }, () => {
          // console.log('updated price...');
          console.log(this.state);
          mixpanel.track('Scrape from Mavelet', {
            userId: Meteor.userId(),
            domain: r.domain,
            title: r.title,
            url: r.url,
            network: r.network,
            retailer: r.retailer,
          });
          utu.track('Scrape from Mavelet', {
            userId: Meteor.userId(),
            domain: r.domain,
            title: r.title,
            url: r.url,
            network: r.network,
            retailer: r.retailer,
          });
          // this.saveProduct();
        });
      }
    });
  },

  // getMeteorData() {
  //   return {
  //     loginState: LoginState.get(),
  //   };
  // },

  handleUserInput(caption, category, description, price, title) {
    if (price !== undefined) {
      this.setState({
        caption,
        category,
        description,
        price: parseFloat(Math.round(price * 100) / 100).toFixed(2),
        title,
      });
    } else {
      this.setState({
        caption,
        category,
        description,
        title,
      });
    }
  },

  changeBoard(bid, checked) {
    const pubBoards = this.state.pubBoards;
    const x = pubBoards.indexOf(bid);

    if (checked && x === -1) {
      pubBoards.push(bid);
    } else if (x !== -1) {
      pubBoards.splice(x, 1);
    }

    this.setState({
      pubBoards,
    }, () => {
      console.log('updated pubBoards');
      console.log(this.state.pubBoards);
    });
  },

  closeWindow() {
    window.close();
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

  saveProduct() {
    console.log('saveProduct');
    // console.log('state: ', this.state);
    const currentUser = Meteor.user();
    const prod = {
      domain: this.state.domain,
      category: this.state.category,
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
    };
    this.setState({ loadingCount: 1 });
    // console.log('product: ', prod);

    Meteor.call('productUpsert', this.state.productId, prod, (e, r) => {
      if (r) {
        console.log('result: ', r);
        this.setState({
          loadingCount: 0,
          productId: r,
          viewState: 'board',
        });
        mixpanel.track('Added Prod from Mavelet', {
          userId: currentUser._id,
          productId: r,
          category: prod.category,
          title: prod.title,
          price: prod.price,
          domain: prod.domain,
        });
        utu.track('Added Prod from Mavelet', {
          userId: currentUser._id,
          productId: r,
          category: prod.category,
          title: prod.title,
          price: prod.price,
          domain: prod.domain,
        });
      } else {
        const type = 'productUpsert';
        const message = e.message;
        Kadira.trackError(type, message);
        console.log('\n\n', message, '\n\n');
      }
    });
  },

  clckPublish() {
    this.setState({
      viewState: 'confirm',
    });

    const currentUser = Meteor.user();

    const prod = {
        // "boardId" : '',  //passed seperately
        // "boardTitle" : '',  //set on the server
      caption: this.state.caption,
      category: this.state.category,
      description: this.state.description,
      domain: this.state.domain,
      images: this.state.images,
      network: this.state.network,
      price: parseFloat(this.state.price) || 0,
      // "productId" : this.state.productId,
      retailer: this.state.retailer,
      title: this.state.title,
      url: this.state.url,
      surl: this.state.surl,
      aurlType: this.state.aurlType,
      userId: currentUser._id,
    };

    // console.log('aurlType: ', prod);
    const pid = this.state.productId;

    this.state.pubBoards.forEach((bid) => {
        // console.log("bid: " + bid);
        // prod.boardId = bid;
      console.log("calling addProdToBoard", bid, pid, prod);
      Meteor.call('addProdToBoard', bid, pid, prod);
      console.log("calling mxp");
      mixpanel.track('Added Clip from Mavelet', {
        boardId: bid,
        userId: currentUser._id,
        productId: pid,
        title: prod.title,
        category: prod.category,
        price: prod.price,
        domain: prod.domain,
      });
      utu.track('Added Clip from Mavelet', {
        boardId: bid,
        userId: currentUser._id,
        productId: pid,
        title: prod.title,
        category: prod.category,
        price: prod.price,
        domain: prod.domain,
      });
    });
  },

  isValidProduct() {
    const { title, category, description, price, caption } = this.state;
    try {
      return !!(title && description && parseFloat(price) && caption && category);
      // return !!(title && description && caption);  // price no longer required
    } catch (e) {
      return false;
    }
  },

  render() {
    if (this.state.loadingCount) {
      return (
        <Loader />
      );
    }
    let curView = '';
    let curBtn = '';

    // if (this.data.loginState === LoginState.LOGGED_IN) {
    switch (this.state.viewState) {
      case 'product':
        curView = (
          <MaveletAddProduct
            ref="addProduct"
            {...this.state}
            onSave={this.saveProduct}
            onUserInput={this.handleUserInput}
          />
        );
        curBtn = (
          <ModalActions
            actions={[{
              label: 'Cancel',
              action: this.closeWindow,
            }, {
              label: 'Next',
              action: (e) => this.refs.addProduct.editProduct(e),
            }]}
          />
        );
        break;
      case 'board':
        curView = (
          <MaveletPubBoard
            {...this.state}
            selectBoard={this.selectBoard}
            deselectBoard={this.deselectBoard}
            selectedBoards={this.state.pubBoards}
          />
        );
        curBtn = (
          <ModalActions
            actions={[{
              label: 'Cancel',
              action: this.closeWindow,
            }, {
              label: 'Done',
              action: this.clckPublish,
              disabled: (!this.state.pubBoards || this.state.pubBoards.length === 0),
            }]}
          />
        );
        break;
      case 'confirm':
        curView = (
          <MaveletConfirm openNewWindows {...this.state} />
        );
        curBtn = (
          <ModalActions
            actions={[{
              label: 'Close',
              action: this.closeWindow,
            }]}
          />
        );
        break;
      default:
    }
    // }

    return (
      <div className="container-fluid mavelet-blotter">
        <div className="mavelet-header" />
        <div className="mavelet-contents">
          {
            curView
          }
        </div>
        <div className="modal-footer">
          {
            curBtn
          }
        </div>
      </div>
    );
  },
});

const AuthenticatedMavelet = CanHOC(Mavelet, {
  allowNonVerified: true,
  denyExit: true,
});
export default AuthenticatedMavelet;
