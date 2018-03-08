import React from 'react';
import { Meteor } from 'meteor/meteor';
// import _ from 'lodash';
import { _ } from 'meteor/underscore';

import Subscriptions from '/imports/data/subscriptions';
import { CalculateQuery } from '/imports/modules/calculate_query';
import { MeteorListData } from '/imports/ui/helpers';
import Boards from '/imports/modules/boards/collection';
import { composeWithTracker } from 'react-komposer';
import PageMessage from '/imports/ui/components/page_message';

import ListCard from '/imports/ui/components/cards/list_card';
import { filterState } from '/imports/ui/components/bars/search_bar';

const EmptyMessage = ({ filter, keyword }) => {
  if (!!keyword) {
    return (
      <PageMessage>
        No boards were found that match your search terms.  Please try new search terms.
      </PageMessage>
    );
  }

  if (filter === 'my') {
    return (
      <PageMessage>
        <p>You have no boards.</p>
        <p>
          To add a product clipping, create a board first and then clip products to that board.
        </p>
      </PageMessage>
    );
  } else if (filter === 'myFavoriteBoards') {
    return (
      <PageMessage>
        <p>None of your favorite boards are "open" boards.</p>
      </PageMessage>
    );
  }

  return (
    <PageMessage>
      <p>No "open" public boards found.</p>
    </PageMessage>
  );
};

const MaveletPubBoardPage = React.createClass({
  propTypes: {
    docs: React.PropTypes.array,
    selectBoard: React.PropTypes.func,
    deselectBoard: React.PropTypes.func,
    selectedBoards: React.PropTypes.array,
  },

  render() {
    const { docs, selectBoard, deselectBoard, selectedBoards, page, keyword, controller } = this.props;

    if (docs.length === 0 && page === 0) {
      return (
        <div>
          <EmptyMessage filter={controller} keyword={keyword} />
        </div>
      );
    }

    return (
      <div>
        {
          docs.map((doc) => {
            const checked = _.contains(selectedBoards, doc._id);
            const toggleChecked = checked ?
                () => { deselectBoard(doc._id); } :
                () => { selectBoard(doc._id); };

            return (
              <ListCard
                board={doc}
                key={doc._id}
                showCheckbox
                checked={checked}
                toggleChecked={toggleChecked}
              />
            );
          })
        }
      </div>);
  },
});

/*
 * Provide the data for a single page in the mavelet board selector
 */
const calcQueryHelpers = (props) => {
  // console.log('calcQueryHelpers: ', props);
  const qh = ['sorted', 'paged', 'limit', 'byKeyword'];
  qh.push(props.controller);
  return qh;
};

const subscribe = (props) => {
  // console.log('subscribe: ', props);
  const queryHelpers = calcQueryHelpers(props);
  return Subscriptions.subscribe('boardsByKeyword', props.keyword, queryHelpers, props.page);
};

const documents = (props) => {
  // console.log('documents: ', props);

    // Calculate Params
  const params = _.pick(props, 'page');
  params.keyword = props.keyword;
  params.userId = Meteor.userId();

  // Calc query helpers used
  const queryHelpers = calcQueryHelpers(props);
  queryHelpers.push('nonReactive');

  const query = CalculateQuery(Boards.queryHelpers, queryHelpers, params);
  return Boards.find(...query).fetch();
};

const MaveletPubBoardPageWData = composeWithTracker(
  MeteorListData({ subscribe, documents })
)(MaveletPubBoardPage);

export default MaveletPubBoardPageWData;
