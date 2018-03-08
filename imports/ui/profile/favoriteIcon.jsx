/* global utu */
import { compose, composeWithTracker, composeAll } from 'react-komposer';
import mixpanel from 'mixpanel-browser';
import { showLogin } from '../components/login/modal';
import FavoriteBtn from '../lib/icons/favorite';
import FavoriteUser from '../../api/users/methods/favorite';
import canHOF from '../../modules/can/can_hof';
import data from '../../data/users/byId';

const toggle = (user) => {
  const args = {
    _id: user._id,
    favorite: !user.userFavorite(),
  };

  canHOF({
    action: 'favorite',
    type: 'user',
    handleLogin: () => {
      showLogin({ message: 'To favorite a user please login or create an account.' });
    },
    handleAction: () => {
      FavoriteUser.call(args, () => {
        mixpanel.track(`${args.favorite ? 'Fav' : 'Unfav'} User`, {
          userId: user._id,
        });
        utu.track(`${args.favorite ? 'Fav' : 'Unfav'} User`, {
          userId: user._id,
        });
      });
    },
  })();
};

export default composeAll(
  compose(({ user }, onData) => {
    if (user) {
      onData(null, {
        active: user.userFavorite(),
        onClick: () => toggle(user),
      });
    }
  }),
  composeWithTracker(data)
)(FavoriteBtn);
