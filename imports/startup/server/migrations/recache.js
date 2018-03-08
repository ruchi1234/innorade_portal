import { Meteor } from 'meteor/meteor';
import { Migrations } from 'meteor/percolate:migrations';
import { HTTP } from 'meteor/http';

import Boards from '/imports/modules/boards/collection';
import Clips from '/imports/modules/clips/collection';

const { token } = Meteor.settings.PrerenderIO;
const recache = (url, cb) => {
  console.log(`Recaching ${url}`);
  if (Meteor.isProduction) {
    HTTP.call(
      'POST',
      'http://api.prerender.io/recache',
      { data: { url, prerenderToken: token } },
      cb
    );
  }
};

export const recacheBoards = (version) => {
  Migrations.add({
    version,
    name: 'Recache boards',
    up: () => {
      Boards.find().forEach((b) => {
        recache(Meteor.absoluteUrl(`board/${b._id}`));
        recache(Meteor.absoluteUrl(`embed/board/${b._id}`));
      });
    },
  });
};

export const recacheClips = (version) => {
  Migrations.add({
    version,
    name: 'Recache clips',
    up: () => {
      Clips.find().forEach((c) => {
        recache(Meteor.absoluteUrl(`product/${c._id}`));
        recache(Meteor.absoluteUrl(`embed/product/${c._id}`));
      });
    },
  });
};

export const recacheUsers = (version) => {
  Migrations.add({
    version,
    name: 'Recache users',
    up: () => {
      Meteor.users.find().forEach((u) => {
        recache(Meteor.absoluteUrl(`profile/${u.slug}`));
        recache(Meteor.absoluteUrl(`embed/profile/${u.slug}`));
      });
    },
  });
};
