/* global utu */
import React from 'react';
import { _ } from 'meteor/underscore';
import { Meteor } from 'meteor/meteor';
import mixpanel from 'mixpanel-browser';

import Form from '/imports/ui/components/bproducts/edit_form';
import MaveletPubBoard from '/imports/ui/components/mavelet/mavelet_pub_board';
import MaveletConfirm from '/imports/ui/components/bproducts/add_multi_board_confirm';
import { openModal, closeModal } from '/imports/data/modal';
import { Header, Body, Actions, Content } from '/imports/ui/components/modal';
import { composeWithTracker } from 'react-komposer';
import { hof as dataHOF } from '/imports/data/clips/byId';

const ReclipModal = React.createClass({
  getInitialState() {
    return _.extend({
      currentPage: 0,
      clip: {},
      loading: false,
      pubBoards: [],
    }, this.props);
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
    const prod = Object.assign({}, this.state, {
      price: parseFloat(this.state.clip.price) || 0,
      url: this.props.rurl || this.props.url,
    });

    const pid = this.props.productId;
    this.state.pubBoards.forEach((bid) => {
      Meteor.call('addProdToBoard', bid, pid, prod);
      mixpanel.track('Added Clip from Clip', {
        boardId: bid,
        // creatorId: Meteor.userId(),
        productId: pid,
        title: prod.title,
        price: prod.price,
        domain: prod.domain,
      });
      utu.track('Added Clip from Clip', {
        boardId: bid,
        // creatorId: Meteor.userId(),
        productId: pid,
        title: prod.title,
        price: prod.price,
        domain: prod.domain,
      });
    });
    this.setState({ currentPage: 2 });
  },

  modalContent() {
    const { currentPage } = this.state;
    switch (currentPage) {
      case 0: { // edit clipping details
        if (this.state.clip) {
          return (
            <Form
              boardProduct={this.state}
              ref="form"
              label="Re-clip product clipping"
              onSave={(c) => {
                this.setState(_.extend({
                  clip: Object.assign({}, this.state.clip, c),
                  currentPage: 1,
                }, c));
                mixpanel.track('Edit Clip from Clip', {
                  caption: this.state.clip.caption,
                  description: this.state.clip.description,
                  domain: this.props.domain,
                  images: this.props.images,
                  network: this.props.network,
                  price: parseFloat(this.state.clip.price) || 0,
                  retailer: this.props.retailer,
                  title: this.state.clip.title,
                  url: this.props.rurl || this.props.url,
                });
                utu.track('Edit Clip from Clip', {
                  caption: this.state.clip.caption,
                  description: this.state.clip.description,
                  domain: this.props.domain,
                  images: this.props.images,
                  network: this.props.network,
                  price: parseFloat(this.state.clip.price) || 0,
                  retailer: this.props.retailer,
                  title: this.state.clip.title,
                  url: this.props.rurl || this.props.url,
                });
              }}
            />
          );
        }
      }
      case 1: {
        return (
          <MaveletPubBoard
            {...this.state}
            selectBoard={this.selectBoard}
            deselectBoard={this.deselectBoard}
            selectedBoards={this.state.pubBoards}
          />
        );
      }
      case 2: {
        return (
          <MaveletConfirm
            {...this.state}
          />
        );
      }
      default:
    }
  },

  modalFooter() {
    const { currentPage } = this.state;
    switch (currentPage) {
      case 0: { // edit caption
        return (
          <Actions
            actions={[{
              label: 'Cancel',
              action: () => closeModal(),
            }, {
              label: 'Next',
              action: () => this.refs.form.editProduct(),
            }]}
          />
        );
      }
      case 1: { // choose board
        return (
          <Actions
            actions={[{
              label: 'Back',
              action: () => this.setState({ currentPage: 0 }),
            }, {
              label: 'Done',
              action: () => (this.state.pubBoards.length && this.clckPublish()),
              disabled: !this.state.pubBoards.length,
            }]}
          />
        );
      }
      case 2: { // board confirm
        return (
          <Actions
            actions={[{
              label: 'Done',
              action: () => closeModal(),
            }]}
          />
        );
      }
      default:
        return undefined;
    }
  },

  render() {
    return (
      <Content>
        <Header />
        <Body>
          {this.modalContent()}
        </Body>
        {this.modalFooter()}
      </Content>
    );
  },
});

const ReclipModalWData = composeWithTracker(
  dataHOF({ waitForData: true })
)(
  ({ clip, ...rest }) => <ReclipModal {...clip} {...rest} />
);
export default props => openModal(<ReclipModalWData {...props} />);
