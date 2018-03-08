import { Migrations } from 'meteor/percolate:migrations';
import Users from '/imports/modules/users/users';

const removeSocial = (social) => {
  const toUnset = {};
  switch (social) {
    case 'facebook':
      toUnset['profile.facebookFriends'] = 1;
      toUnset['profile.facebookId'] = 1;
      break;
    case 'twitter':
      toUnset['profile.twitterScreenName'] = 1;
      toUnset['profile.twitterFollowers'] = 1;
      break;
    case 'instagram':
      toUnset['profile.instagramUsername'] = 1;
      toUnset['profile.instagramFollowers'] = 1;
      break;
    case 'pinterest':
      toUnset['profile.pinterestFollowers'] = 1;
      toUnset['profile.pinterestUrl'] = 1;
      break;
    default:
      break;
  }
  return toUnset;
};

Migrations.add({
  version: 46,
  name: 'Clear dead data from users',
  up: () => {
    Users.find({}).forEach((u) => {
      const toUnset = {};
      if (!u.services.facebook) {
        Object.assign(toUnset, removeSocial('facebook'));
      }

      if (!u.services.twitter) {
        Object.assign(toUnset, removeSocial('twitter'));
      }

      if (!u.services.instagram) {
        Object.assign(toUnset, removeSocial('instagram'));
      }

      if (!u.services.pinterest) {
        Object.assign(toUnset, removeSocial('pinterest'));
      }

      if (Object.keys(toUnset).length) {
        Users.update({ _id: u._id }, { $unset: toUnset });
      }
    });
  },
});
