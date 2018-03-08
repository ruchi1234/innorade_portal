/* global utu */
import FavoriteBoard from '/imports/api/boards/methods/favorite';
import canHOF from '/imports/modules/can/can_hof';
import data from '/imports/data/boards/byId';
import { compose, composeWithTracker, composeAll } from 'react-komposer';
import mixpanel from 'mixpanel-browser';
import { showLogin } from '/imports/ui/components/login/modal';
import FavoriteBtn from '/imports/ui/components/favorite_btn';

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
        toggle: () => toggle(board),
      });
    }
  }),
  composeWithTracker(data)
)(FavoriteBtn);
