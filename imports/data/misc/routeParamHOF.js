import { FlowRouter } from 'meteor/kadira:flow-router';

export default (key) => ((props, onData) => {
  const data = {};
  data[key] = FlowRouter.getParam(key);
  onData(null, data);
});
