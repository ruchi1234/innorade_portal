import Subscriptions from '/imports/data/subscriptions';
import Users from '/imports/modules/users/users';

export default (props, onData) => {
  if (!props.userId) { onData(null, {}); return undefined; }

  const sub = Subscriptions.subscribe('users.byId', props.userId);

  const user = Users.findOne({ _id: props.userId });
  // TODO: Help me...
  // if (user) {
  //   board.creator = board.creator || {};
  // }

  onData(null, {
    user,
    ready: sub.ready(),
  });

  return () => { sub.stop(); };
};
