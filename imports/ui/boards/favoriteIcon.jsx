/* global utu */
import { compose, composeWithTracker, composeAll } from 'react-komposer';
import mixpanel from 'mixpanel-browser';
import { showLogin } from '../components/login/modal';
import FavoriteBtn from '../lib/icons/favorite';
import FavoriteBoard from '../../api/boards/methods/favorite';
import canHOF from '../../modules/can/can_hof';
import data from '../../data/boards/byId';

const toggle = (board) => {
  const args = {
    _id: board._id,
    favorite: !board.userFavorite(),
  };

  canHOF({
    action: 'favorite',
    type: 'board',
    handleLogin: () => {
      showLogin({ message: 'To mark a board as a favorite, please login or create an account.' });
    },
    handleAction: () => {
      FavoriteBoard.call(args, () => {
        mixpanel.track(`${args.favorite ? 'Fav' : 'Unfav'} Board`, {
          boardId: board._id,
        });
        utu.track(`${args.favorite ? 'Fav' : 'Unfav'} Board`, {
          boardId: board._id,
        });
      });
    },
  })();
};

export default composeAll(
  compose(({ board }, onData) => {
    if (board) {
      onData(null, {
        active: board.userFavorite(),
        onClick: () => toggle(board),
      });
    }
  }),
  composeWithTracker(data)
)(FavoriteBtn);
