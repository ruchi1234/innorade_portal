import React, { PropTypes } from 'react';

import { FlowRouter } from 'meteor/kadira:flow-router';
import { isURL } from '/imports/modules/domain_utils';
import Col from '/imports/ui/components/grid/col';
import Row from '/imports/ui/components/grid/row';

const ProductWiz0 = React.createClass({
  propTypes: {
    onScrape: PropTypes.func.isRequired,
    handleClose: PropTypes.func.isRequired,
  },
  onScrape() {
    const { scrapeurl } = this.refs;
    if (isURL(scrapeurl.value)) {
      this.props.onScrape(
        scrapeurl.value
      );
    } else {
      Bert.alert(
        'Please verify you have a valid URL entered!',
        'danger',
        'fixed-top',
        'fa-frown-o'
      );
    }
  },
  onGetMavelet() {
    FlowRouter.go('getmavelet');
    this.props.handleClose();
  },
  render() {
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
                onClick={this.props.handleClose}
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
