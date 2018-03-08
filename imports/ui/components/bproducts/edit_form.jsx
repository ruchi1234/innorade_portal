import { Meteor } from 'meteor/meteor';
import React from 'react';
import $ from 'jquery';
import CurrencyMaskedInput from 'react-currency-masked-input';
import { _ } from 'meteor/underscore';
import CategorySelect from '/imports/ui/components/bproducts/category_select.jsx';

// import Bert from 'meteor/themeteorchef:bert';

/*
 ** file: client/components/edit_product.jsx
 ** by: MavenX - sboyd Apr 2016
 ** re: This allows a maven to edit their own product listing,
 **      or any other listing they are authorized to edit.
// This takes a board product object and an updateProduct function as props.
// Link this in product_detail.jsx
*/

const formatCurrency = (num) => `$${parseFloat(String(num)).toFixed(2).replace(/(\d)(?=(\d\d\d)+(?!\d))/g, '$1,')}`;

export default React.createClass({
  propTypes: {
    boardProduct: React.PropTypes.object,
  },

  getInitialState() {
    const bp = this.props.boardProduct;
    const price = _.isNumber(bp.price) ? bp.price : 0;
    const caption = (!bp.creatorId || Meteor.userId() === bp.creatorId) ? bp.caption : '';
    const category = bp.category || '';
    return {
      title: this.props.boardProduct.title,
      caption,
      category,
      price,
      description: this.props.boardProduct.description,
    };
  },

  retailerOutNetwork() {
    if (!this.props.boardProduct.network) {
      return (
        <div className="align-center alert alert-warning">
          Retailer not in network&nbsp;
          <span className="glyphicon glyphicon-warning-sign"></span>
        </div>
      );
    }
  },

  setCaption(event) {
    this.setState({ caption: event.target.value });
  },

  setCategory(event) {
    this.setState({ category: event.target.value });
  },

  setDescription(event) {
    this.setState({ description: event.target.value });
  },

  setPrice(event, value) {
    this.setState({ price: (value || '0').replace(/\$|,/g, '') });
  },

  setTitle(event) {
    this.setState({ title: event.target.value });
  },

  editProduct(event) {
    if (event) event.preventDefault();
    const { title, category } = this.state;

    if (!title) {
      Bert.alert(
        'Product Name is required!',
        'danger',
        'fixed-top',
        'fa-frown-o'
      );
      return;
    }

    if (!category) {
      Bert.alert(
        'Category is required!',
        'danger',
        'fixed-top',
        'fa-frown-o'
      );
      return;
    }

    const product = {
      // _id: this.props.boardProduct._id,
      caption: this.state.caption || '',
      category: this.state.category || '',
      description: this.state.description,
      price: this.state.price ? parseFloat(String(this.state.price).replace(/\$|,/g, '')) : 0,
      title: this.state.title,
    };
    this.props.onSave(product);
  },

  value() {
    return this.state;
  },

  render() {
    const { label } = this.props;
    return (
      <section className="modal-body-inner questionScreen">
        <h2 className="modal-title">
          {label || 'Edit product clipping'}
        </h2>
        {this.retailerOutNetwork()}
        <form>
          <div className="form-group">
            <label htmlFor="prod-title">
              Product Name
            </label>
            <textarea
              maxLength="10000"
              id="prod-title"
              ref="prodtitle"
              type="text"
              placeholder="Enter a name for the product."
              className="form-control-custom form-control"
              value={this.state.title}
              onChange={this.setTitle}
            />
          </div>
          <div className="form-group">
            <label htmlFor="prod-caption">
              Your Product Caption <span className="hint">(optional)</span>
            </label>
            <textarea
              maxLength="10000"
              id="prod-caption"
              ref="prodcaption"
              rows="5"
              placeholder="Explain here why you like this product."
              className="form-control form-control-custom"
              value={this.state.caption}
              onChange={this.setCaption}
            />
          </div>
          <CategorySelect value={this.state.category || ''} onChange={this.setCategory} />
          <div className="form-group">
            <label
              id="prod-price-label"
              htmlFor="prod-price"
            >
              Price <span className="hint">(optional)</span>
            </label>
            <CurrencyMaskedInput
              id="prod-price"
              ref="prodprice"
              type="text"
              className="form-control form-control-custom currency"
              placeholder="Amount"
              value={formatCurrency(this.state.price)}
              onChange={this.setPrice}
            />
          </div>
          <div className="form-group">
            <label htmlFor="prod-description">
              Product Description
            </label>
            <textarea
              maxLength="10000"
              id="prod-description"
              ref="proddescription"
              rows="5"
              placeholder="Enter a description for the product."
              className="form-control form-control-custom"
              value={this.state.description}
              onChange={this.setDescription}
            />
          </div>
        </form>
      </section>
    );
  },
});
