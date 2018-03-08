import React from 'react';
import { composeWithTracker } from 'react-komposer';
import { FlowRouter } from 'meteor/kadira:flow-router';

import ListCard from '/imports/ui/components/cards/list_card';

import data from '/imports/data/boards/byId';

const Spotlight = ({ board }) => (board ?
  <div>
    <ListCard board={board} className="spotlight" onClick={() => FlowRouter.go('board', { _id: board._id })} />
  </div> : <span></span>
);


Spotlight.propTypes = {
  board: React.PropTypes.object,
};

const SpotlightWData = composeWithTracker(data)(Spotlight);
export default SpotlightWData;
export { Spotlight as Component };
