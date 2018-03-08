import Subscriptions from '/imports/data/subscriptions';
import Clips from '/imports/modules/clips/collection';

export const hof = ({ waitForData }) => (props, onData) => {
  if (!props.clipId) { onData(null, {}); return undefined; }

  const sub = Subscriptions.subscribe('boardProducts/byId', props.clipId);

  const clip = Clips.findOne(props.clipId);

  if (!waitForData || clip) {
    onData(null, {
      clip,
      ready: sub.ready(),
    });
  }

  return () => { sub.stop(); };
};

export default hof({ waitForData: false });
