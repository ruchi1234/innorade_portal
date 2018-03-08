import React from 'react';
import QuotesPagedMasonry from '/imports/ui/components/quotes/paged_masonry';

/*
** file: client.modules.products.product_list.jsx
** by: MavenX - tewksbum May 2016
** re: Listing of MECE product records
*/

const QuotesList = React.createClass({

  propTypes: {
    controller: React.PropTypes.string,
    keyword: React.PropTypes.string,
    filter: React.PropTypes.string,
    productId: React.PropTypes.string,
    bproductId: React.PropTypes.string,
  },

  componentWillReceiveProps() {
    this.refs.masonry.reset();
  },

  render() {
    const { controller, keyword, filter, productId, bproductId } = this.props;

    const queryHelpers = [];
    if (filter) { queryHelpers.push(filter); }
    if (controller) { queryHelpers.push(controller); }

    return (
      <div className="wrapper">
        <QuotesPagedMasonry
          ref="masonry"
          productId={productId}
          bproductId={bproductId}
          queryHelpers={queryHelpers}
          keyword={keyword}
        />
      </div>
    );
  },
});

export default QuotesList;
