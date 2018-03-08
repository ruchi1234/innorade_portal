import React from 'react';
import { composeWithTracker } from 'react-komposer';
import FlowHelpers from '/imports/startup/flow_helpers';

NavMenu.propTypes = {
  onAction: React.PropTypes.func,
  loggedIn: React.PropTypes.bool,
  currentRoute: React.PropTypes.string,
};

// FIXME: what is data here?
const NavMenuWData = composeWithTracker(data)(NavMenu);
export default NavMenuWData;
export { NavMenu };

// NavMenu = MeteorData(NavMenu, {
//   getData() {
//     return {
//       currentRoute: FlowRouter.current().route.name,
//       loggedIn: !!Meteor.userId(),
//     };
//   },
// });
