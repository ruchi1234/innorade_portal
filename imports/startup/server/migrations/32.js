import { Meteor } from 'meteor/meteor';
import { Migrations } from 'meteor/percolate:migrations';
import { HTTP } from 'meteor/http';
import Boards from '/imports/modules/boards/collection';
import Clips from '/imports/modules/clips/collection';

const { token } = Meteor.settings.PrerenderIO;
const recache = (url) => {
  console.log(`Recaching ${url}`);
  if (Meteor.isProduction) {
    HTTP.call(
      'POST',
      'http://api.prerender.io/recache',
      { data: { url, prerenderToken: token } }
    );
  }
};

Migrations.add({
  version: 32,
  name: 'Recache all embeded boards and clips',
  up: () => {
    Boards.find().forEach((b) => {
      recache(Meteor.absoluteUrl(`embed/board/${b._id}`));
    });

    Clips.find().forEach((c) => {
      recache(Meteor.absoluteUrl(`embed/board/${c._id}`));
    });
  },
});
