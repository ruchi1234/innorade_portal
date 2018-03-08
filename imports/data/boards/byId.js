import Subscriptions from '/imports/data/subscriptions';
import Boards from '/imports/modules/boards/collection';

export default (props, onData) => {
  if (!props.boardId) { onData(null, {}); return undefined; }

  const sub = Subscriptions.subscribe('boards.byId', props.boardId);

  const board = Boards.findOne({ _id: props.boardId });
  if (board) {
    board.creator = board.creator || {};
  }

  onData(null, {
    board,
    ready: sub.ready(),
  });

  return () => { sub.stop(); };
};
