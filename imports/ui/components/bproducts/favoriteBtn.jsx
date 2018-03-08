/* global utu */
import FavoriteClip from '/imports/api/clips/methods/favorite';
import canHOF from '/imports/modules/can/can_hof';
import data from '/imports/data/clips/byId';
import { compose, composeWithTracker, composeAll } from 'react-komposer';
import mixpanel from 'mixpanel-browser';
import { showLogin } from '/imports/ui/components/login/modal';
import FavoriteBtn from '/imports/ui/components/favorite_btn';

const toggle = (clip) => {
  const args = {
    _id: clip._id,
    favorite: !clip.userFavorite(),
  };

  canHOF({
    action: 'favorite',
    type: 'clip',
    handleLogin: () => {
      showLogin({ message: 'To mark a clipping as a favorite, please login or create an account.' });
    },
    handleAction: () => {
      FavoriteClip.call(args, () => {
        mixpanel.track(`${args.favorite ? 'Fav' : 'Unfav'} Clip`, {
          clipId: clip._id,
        });
        utu.track(`${args.favorite ? 'Fav' : 'Unfav'} Clip`, {
          clipId: clip._id,
        });
      });
    },
  })();
};

export default composeAll(
  compose(({ clip }, onData) => {
    if (clip) {
      onData(null, {
        active: clip.userFavorite(),
        toggle: () => toggle(clip),
      });
    }
  }),
  composeWithTracker(data)
)(FavoriteBtn);
