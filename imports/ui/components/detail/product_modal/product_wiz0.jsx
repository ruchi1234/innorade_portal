import React from 'react';
import { Meteor } from 'meteor/meteor';
import { isURL } from '/imports/modules/domain_utils';
import { FlowRouter } from 'meteor/kadira:flow-router';
import Loader from '/imports/ui/components/loader';

// import ModalFooter from '/imports/ui/components/modal/modal_footer';
// import ModalBody from '/imports/ui/components/modal/modal_body';
// import CancelFooter from '/imports/ui/components/modal/cancel_footer';

import Col from '/imports/ui/components/grid/col';
import Row from '/imports/ui/components/grid/row';

/**
 * file: client.modules.boards.boardwize.boardwiz0.jsx
 * by: MavenX - tewksbum Apr 2016
 * re: first page of board wizard
 */

const ProductWiz0 = React.createClass({
  propTypes: {
    onScrape: React.PropTypes.func.isRequired,
    onCancel: React.PropTypes.func,
  },

  getInitialState() {
    return {
      loading: false,
    };
  },

  onScrape(params) {
    const { scrapeurl } = this.refs;
    if (isURL(scrapeurl.value)) {
      this.setState({ loading: true });
      Meteor.call('scrapeTitleDescriptionImages', scrapeurl.value, (e, r) => {
        if (r) {
          const product = r;
          product.surl = scrapeurl.value;
          this.props.onScrape(product);
        }
        this.setState({ loading: false });
      });
    } else {
      Bert.alert('Please verify you have a valid URL entered!', 'danger',
        'fixed-top', 'fa-frown-o');
    }
  },

  onGetMavelet() {
    FlowRouter.go('getmavelet');
  },

  render() {
    if (this.state.loading) {
      return (
        <Loader />
      );
    }
    return (
      <section className="addProductModal">
        <div
          className="modal-body-inner product-wiz"
        >
          <h2
            className="modal-title"
          >
            Add Product
          </h2>
          <Row>
            <Col xs={12} md={12} lg={12}>
              <p
                className="wiz-description"
              >
                copy & paste the URL/address of the product from the retailer’s
                website into the below:
              </p>
              <input
                id="scrapeurl"
                ref="scrapeurl"
                type="text"
                placeholder="Paste retailer product page URL here."
              />
              <div className="buttonContainer">
                <button
                  className="btn-custom"
                  onClick={this.onCancel}
                >
                  Cancel
                </button>
                <button
                  className="btn-custom"
                  onClick={this.onScrape}
                >
                  Next
                </button>
              </div>
            </Col>
          </Row>
          <Row>
            <Col xs={12} md={12} lg={12}>
              <div>
                <p
                  className="wiz-description"
                >
                  Get the Mavelet button to add product clippings to Maven while you browse online retail websites. It makes adding clippings as simple as a click!
                </p>
                <button
                  className="btn-custom next"
                  onClick={this.onGetMavelet}
                >
                  Get the Mavelet Button
                </button>
              </div>
            </Col>
          </Row>
        </div>
      </section>
    );
  },
});

export default ProductWiz0;
