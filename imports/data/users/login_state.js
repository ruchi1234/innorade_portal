import { Meteor } from 'meteor/meteor';
import Subscriptions from '/imports/data/subscriptions';

export default (prop, onData) => {
  const sub = Subscriptions.subscribe('userData');
  onData(null, {
    userId: Meteor.userId(),
    user: Meteor.user(),
    loggedIn: !!Meteor.userId(),
    loggingIn: Meteor.loggingIn(),
    verified: !!(Meteor.user() && Meteor.user().isVerified()),
    ready: sub.ready(),
  });
  return () => sub.stop();
};
