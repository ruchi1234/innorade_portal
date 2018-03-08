import React from 'react';

import Subscriptions from '/imports/data/subscriptions';
import { CalculateQuery } from '/imports/modules/calculate_query';
import BoardProducts from '/imports/modules/clips/collection';
import shallowCompare from 'react-addons-shallow-compare';

import PagedMasonryHOC from '/imports/ui/components/masonry/paged_masonry_hoc';

import QuoteCard from '/imports/ui/components/cards/quote_card';

const calcQueryHelpers = (props) => {
  const qh = ['sorted', 'paged', 'limit', 'byProductId'];
  if (props.queryHelpers) {
    qh.push(...props.queryHelpers);
  }
  return qh;
};


class Tile extends React.Component {
  shouldComponentUpdate(nextProps, nextState) {
    return shallowCompare(this, nextProps, nextState);
  }

  render() {
    const { doc } = this.props;
    let card = _.pick(doc, '_id', 'boardId', 'boardTitle', 'caption',
      'title', 'type');

    card.favoriteCount = doc.favoritedByIds && doc.favoritedByIds.length;

    const creator = doc.getCreator();

    return (<QuoteCard
      card={card}
      typeLabel="quote"
      creatorImage={creator.getImage()}
      creatorName={creator.username}
    />);
  }
}

Tile.propTypes = {
  doc: React.PropTypes.object.isRequired,
};

const QuotesPagedMasonry = PagedMasonryHOC({
  propTypes: {
    bproductId: React.PropTypes.string,
    productId: React.PropTypes.string.isRequired,
  },

  pageSubscribe(props) {
    const queryHelpers = calcQueryHelpers(props);
    return Subscriptions.subscribe('boardProducts/byProductId', props.productId,
      queryHelpers, props.page);
  },

  pageDocuments(props) {
    // Calculate Params
    const params = _.pick(props, 'page');
    params.productId = props.productId;
    params.type = 0; // 0 = public
    params.notBoardProductId = props.bproductId;

    // Calc query helpers used
    const queryHelpers = calcQueryHelpers(props);
    queryHelpers.push('nonReactive');
    queryHelpers.push('notBoardProductId');

    const query = CalculateQuery(BoardProducts.queryHelpers, queryHelpers, params);
    return BoardProducts.find(...query).fetch();
  },

  Tile,
});

export default QuotesPagedMasonry;
