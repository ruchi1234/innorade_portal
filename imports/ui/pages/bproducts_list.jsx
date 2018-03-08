import React from 'react';
import shallowCompare from 'react-addons-shallow-compare';

import BProductsPagedMasonry from '/imports/ui/components/bproducts/paged_masonry';
import mixpanel from 'mixpanel-browser';
import updateDochead from '/imports/modules/update_dochead';

const setDochead = () => {
  const opts = {};
  opts.description = 'At Maven Xchange - shop, share, and earn money by ' +
    'recommending products you know others will love!';

  updateDochead(opts);
};

const BProductsList = React.createClass({
  propTypes: {
    boardId: React.PropTypes.string,
    controller: React.PropTypes.string,
    keyword: React.PropTypes.string,
    filter: React.PropTypes.string,
    reactive: React.PropTypes.bool,
  },

  componentDidMount() {
    setDochead();
  },

  shouldComponentUpdate(nextProps, nextState) {
    return shallowCompare(this, nextProps, nextState);
  },

  componentDidReceiveProps() {
    this.refs.masonry.reset();
  },

  render() {
    const { reactive, boardId, controller, filter, keyword, category } = this.props;

    console.log(boardId, controller)
    const queryHelpers = [];
    // Handle the my page.  Not ideal,
    if (controller) {
      queryHelpers.push(controller);
    }

    if (controller !== 'my') {
      // Something funcky with flow router setQueryPrama
      // result's in filter to be 'All' even when not
      // set in the url
      if (filter && (!boardId || filter !== 'all')) {
        queryHelpers.push(filter);
      }
    }

    return (
      <BProductsPagedMasonry
        ref="masonry"
        boardId={boardId}
        queryHelpers={queryHelpers}
        keyword={keyword}
        category={category}
        reactive={reactive}
      />
    );
  },
});

const BProductsListWData = MeteorData(BProductsList, {
  getData() {
    const filter = FlowRouter.getQueryParam('filter');
    return {
      category: FlowRouter.getQueryParam('category'),
      keyword: FlowRouter.getQueryParam('keyword'),
      filter: (filter && filter.toLowerCase()),
    };
  },
});

export default BProductsListWData;
