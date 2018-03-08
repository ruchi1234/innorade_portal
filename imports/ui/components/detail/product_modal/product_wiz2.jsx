// import { Meteor } from 'meteor/meteor';
import React from 'react';
// import mixpanel from 'mixpanel-browser';
// import { Kadira } from 'meteor/meteorhacks:kadira';

/**
 * file: client.modules.boards.boardwize.boardwiz0.jsx
 * by: MavenX - tewksbum Jun 2016
 * re: first page of board wizard
 */

const ProductWiz2 = React.createClass({
  propTypes: {
    product: React.PropTypes.object.isRequired,
    boardId: React.PropTypes.string.isRequired,
  },

  getInitialState() {
    return {
      productId: '',
      loading: false,
    };
  },

  componentDidMount() {
    // this.onSaveProduct();
  },

  // onSaveProduct() {
  //   const { boardId, product } = this.props;
  //
  //   let thisisahack = 1;
  //   console.log('thisisahack: ', thisisahack);
  //   if (thisisahack === 1) {
  //     Meteor.call('productUpsert', '', product, (e, r) => {
  //       thisisahack = thisisahack + 1;
  //       if (r) {
  //         mixpanel.track('Added product', {
  //           userId: Meteor.userId(),
  //           productId: r,
  //           title: product.title,
  //           price: product.price,
  //           domain: product.domain,
  //         });
  //         Meteor.call('addProdToBoard', boardId, r, product);
  //         mixpanel.track('Boarded product', {
  //           boardId,
  //           mavenId: Meteor.userId(),
  //           productId: r,
  //           title: product.title,
  //           price: product.price,
  //           domain: product.domain,
  //         });
  //       } else {
  //         if (e) {
  //           const type = 'saveProduct';
  //           const message = e.reason;
  //           Kadira.trackError(type, message);
  //           console.log('\n\n', message, '\n\n');
  //         }
  //       }
  //     });
  //   }
  // },

  render() {
    const currentStyle = {
      fontSize: '1.28571rem',
    }
    return (
      <div>
        <h4 style={currentStyle} className="text-center">
          Your product clipping has been created and added to the board.
        </h4>
      </div>
    );
  },
});

export default ProductWiz2;
