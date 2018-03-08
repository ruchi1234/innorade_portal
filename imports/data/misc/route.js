import { FlowRouter } from 'meteor/kadira:flow-router';

export default (props, onData) => {
  onData(null, {
    routeName: FlowRouter.getRouteName(),
  });
};
