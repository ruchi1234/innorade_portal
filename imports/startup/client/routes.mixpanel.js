/* global utu */
import { FlowRouter } from 'meteor/kadira:flow-router';
import mixpanel from 'mixpanel-browser';
import { _ } from 'meteor/underscore';

const LabelMap = {
  boards: 'Boards List',
  board: 'Board Detail',
  myboards: 'My Boards',

  products: 'Clip List',
  product: 'Clip Detail',
  myproducts: 'My Clips',

  referAFriend: 'RAF Page',
  getmavelet: 'Get Mavelet',

  profile: 'Profile',
  myuserledger: 'Dashboard',

  mavelet: 'Start Mavelet',
  mixpanelTrack: 'Social Share Clicked',
  emailTrack: 'Email Clicked',
};

let prevRoute;
let prevParams;
let prevQueryParams = {};
FlowRouter.triggers.enter([() => {
  const sameRoute = FlowRouter.current().route.name === prevRoute;
  prevRoute = FlowRouter.current().route.name;
  const sameParams = _.isEqual(FlowRouter.current().params, prevParams);
  prevParams = FlowRouter.current().params;

  // Only care if keyword changed
  const sameQueryParams = _.isEqual(
    _.pick(FlowRouter.current().queryParams, 'keyword'),
    _.pick(prevQueryParams, 'keyword')
  );
  prevQueryParams = FlowRouter.current().queryParams;
  if (!sameRoute || !sameParams || !sameQueryParams) {
    mixpanel.track(
      LabelMap[FlowRouter.current().route.name],
      {
        params: FlowRouter.current().params,
        queryParams: _.pick(FlowRouter.current().queryParams, 'keyword'),
      }
    );
    if (LabelMap[FlowRouter.current().route.name]) {
      utu.track(
        LabelMap[FlowRouter.current().route.name],
        {
          params: JSON.stringify(FlowRouter.current().params),
          queryParams: _.pick(FlowRouter.current().queryParams, 'keyword'),
        }
      );
    }
  }
}]);
