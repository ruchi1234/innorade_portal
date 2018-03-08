import React from 'react';
import CurrencyMaskedInput from 'react-currency-masked-input';

import Carousel from '../carousel';
import Img from '../img.jsx';
import Row from '../grid/row';
import Col from '../grid/col';

import CategorySelect from '/imports/ui/components/bproducts/category_select.jsx';

const carouselHeight = 450;

/**
 * file: client.components.MaveletAddProduct.jsx
 * by: MavenX - tewksbum Mar 2016
 * re: Post scrape, this it the pop-up that adds the product then publishes to boards
 */
const formatCurrency = num => `$${parseFloat(String(num)).toFixed(2).replace(/(\d)(?=(\d\d\d)+(?!\d))/g, '$1,')}`;

const MaveletFields = React.createClass({
  propTypes: {
    onUserInput: React.PropTypes.func,
    title: React.PropTypes.string,
    desc: React.PropTypes.string,
    cat: React.PropTypes.string,
    price: React.PropTypes.number,
  },

  getInitialState() {
    const category = '';
    return { category };
  },

  setCategory(event) {
    // console.log('event: ', event.target.value);
    this.setState({ category: event.target.value });
    this.props.onUserInput(
      this.refs.prodcaption.value,
      event.target.value,
      this.refs.proddescription.value,
      (this.refs.prodprice.value || '0').replace(/\$|,/g, ''),
      this.refs.prodtitle.value
    );
  },

  handleChange(event) {
    this.props.onUserInput(
      this.refs.prodcaption.value,
      this.state.category,
      this.refs.proddescription.value,
      (this.refs.prodprice.value || '0').replace(/\$|,/g, ''),
      this.refs.prodtitle.value
    );
  },

  render() {
    return (
      <form>
        <div className="form-group">
          <label htmlFor="prod-title">
            Product Name
          </label>
          <input
            id="prod-title"
            ref="prodtitle"
            type="text"
            placeholder="Enter a name for the product."
            className="form-control-custom form-control"
            value={this.props.title}
            onChange={this.handleChange}
          />
          <input id="pid" type="hidden" />
          <input id="url" type="hidden" />
        </div>
        <div className="form-group">
          <label htmlFor="prod-caption">
            Your Product Caption <span className="hint">(optional)</span>
          </label>
          <textarea
            id="prod-caption"
            ref="prodcaption"
            rows="5"
            placeholder="Explain here why you like this product."
            className="form-control form-control-custom"
            onChange={this.handleChange}
          />
        </div>
        <CategorySelect
          ref="prodcategory"
          value={this.props.cat || ''}
          onChange={this.setCategory}
        />
        <div className="form-group">
          <label htmlFor="prod-price">
            Price <span className="hint">(optional)</span>
          </label>
          <div className="input-group">
            <CurrencyMaskedInput
              id="prod-price"
              ref="prodprice"
              type="text"
              className="form-control form-control-custom currency"
              placeholder="Amount"
              value={formatCurrency(this.props.price) || formatCurrency(0)}
              onChange={this.handleChange}
            />
          </div>
        </div>
        <div className="form-group">
          <label htmlFor="prod-description">Product Description</label>
          <textarea
            id="prod-description"
            ref="proddescription"
            rows="5"
            placeholder="Enter a description for your product."
            className="form-control form-control-custom"
            value={this.props.desc}
            onChange={this.handleChange}
          />
        </div>
      </form>
    );
  },
});

const MaveletAddProduct = React.createClass({
  propTypes: {
    onUserInput: React.PropTypes.func,
    loading: React.PropTypes.bool,
    images: React.PropTypes.array,
    network: React.PropTypes.string,
    title: React.PropTypes.string,
    description: React.PropTypes.string,
    price: React.PropTypes.number,
    category: React.PropTypes.string,
  },

  handleUserInput(caption, category, description, price, title) {
    const _price = Number(parseFloat(Math.round(price * 100) / 100).toFixed(2));
    this.props.onUserInput(
      caption,
      category,
      description,
      _price,
      title
    );
  },

  retailerOutNetwork() {
    if (!this.props.loading && !this.props.network) {
      return (
        <div className="align-center alert alert-warning">
          Retailer not in network&nbsp;
          <span className="glyphicon glyphicon-warning-sign" />
        </div>
      );
    }
  },

  editProduct(event) {
    if (event) event.preventDefault();
    const { title, description, price, caption, category } = this.props;

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

    if (!!title && !!category) {
      const product = {
        // _id: this.props.boardProduct._id,
        caption: caption || '',
        category: category || '',
        description,
        price: price ? parseFloat(String(price).replace(/\$|,/g, '')) : 0,
        title,
      };
      this.props.onSave(product);
    }
  },

  render() {
    const { images } = this.props;
    return (
      <div className="modal-body">
        <Row className="header-row">
          <Col sm={12}>
            <h4 className="text-center">
              <strong>Edit product clipping</strong>
            </h4>
            {this.retailerOutNetwork()}
          </Col>
        </Row>
        <Row>
          <Col sm={6}>
            <div className="product-carousel">
              <Carousel>
                {images.map(i => <Img key={i.href} src={i.href} height={carouselHeight} />)}
              </Carousel>
            </div>
          </Col>
          <Col sm={6}>
            <MaveletFields
              title={this.props.title}
              cat={this.props.category}
              desc={this.props.description}
              price={this.props.price}
              images={this.props.images}
              onUserInput={this.handleUserInput}
            />
          </Col>
        </Row>
      </div>
    );
  },
});

export default MaveletAddProduct;
