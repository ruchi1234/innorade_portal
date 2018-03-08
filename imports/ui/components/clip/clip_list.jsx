import React from 'react';

import { DEFAULT_LIMIT } from '/imports/startup/vars';
import { CalculateQuery } from '/imports/modules/calculate_query';
import BoardProducts from '/imports/modules/clips/collection';

import ClipCard from '/imports/ui/components/cards/clip_card';

import Subscriptions from '/imports/data/subscriptions';

const ClipList = React.createClass({

  propTypes: {
    boardProducts: React.PropTypes.array.isRequired,
    loadMore: React.PropTypes.func,
    cleanup: React.PropTypes.func,
    finalCleanup: React.PropTypes.func,
  },

  componentWillReceiveProps() {
    this.props.cleanup();
  },

  componentWillUnmount() {
    this.props.cleanup();
  },

  render() {
    const { boardProducts } = this.props;

    return (
      <ul>
        {
          boardProducts.map((doc) => {
            return (
              <ClipCard
                boardProduct={doc}
                key={doc._id}
              />
            );
          })
        }
      </ul>
    );
  },
});


const page = new ReactiveVar(1);
const QUERY_HELPERS = ['sorted', 'byProductId', 'my'];
const ClipListWData = MeteorData(ClipList, {
  getData(props) {
    /*
     * If no boardId found do nothing
     */
    if (!props.productId) { return { boardProducts: [], cleanup() {}, finalCleanup() {} }; }

    /*
     * Subscribe to each
     */
    const subs = [];
    _.times(page.get(), (i) => {
      subs.push(Subscriptions.subscribe('boardProducts/byProductId',
        props.productId,
        QUERY_HELPERS, i)
      );
    });

    const maxReturnCount = DEFAULT_LIMIT * page.get();
    const params = {
      productId: props.productId,
      userId: props.userId,
    };
    const query = CalculateQuery(BoardProducts.queryHelpers, QUERY_HELPERS, params);
    query[1].limit = maxReturnCount;
    const boardProducts = BoardProducts.find(...query).fetch();

    return {
      boardProducts,
      loadMore() {
        if (maxReturnCount === boardProducts.length) {
          page.set(page.get() + 1);
        }
      },
      cleanup() {
        _.each(subs, (sub) => {
          sub.stop();
        });
      },
      finalCleanup() {
        page.set(1);
      },
    };
  },
});

export default ClipListWData;
