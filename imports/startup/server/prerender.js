import { Meteor } from 'meteor/meteor';
import Boards from '/imports/modules/boards/collection';
import Clips from '/imports/modules/clips/collection';
import { HTTP } from 'meteor/http';

// Let's avoid ddosing prerender for non prod env
// This should leave it intact for staging though
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

const recacheClip = (userId, doc) => {
  // Fuck this blows
  // We need routes on both client and server, so we
  // don't have duplicate shitty route logic throughout
  // the app.  Fucking mixpanel get's in the way though
  // of having routes on server.  The fucking import tries
  // to use window.  Typical shitty npm packages.
  //
  // TODO Flow router goes here
  recache(Meteor.absoluteUrl(`product/${doc._id}`));
  recache(Meteor.absoluteUrl(`embed/product/${doc._id}`));
};

Clips.after.insert(recacheClip);
Clips.after.update(recacheClip);


const recacheBoard = (userId, doc) => {
  // Fuck this blows
  // We need routes on both client and server, so we
  // don't have duplicate shitty route logic throughout
  // the app.  Fucking mixpanel get's in the way though
  // of having routes on server.  The fucking import tries
  // to use window.  Typical shitty npm packages.
  //
  // TODO Flow router goes here
  recache(Meteor.absoluteUrl(`board/${doc._id}`));
  recache(Meteor.absoluteUrl(`embed/board/${doc._id}`));
};

Boards.after.insert(recacheBoard);
Boards.after.update(recacheBoard);

const recacheUser = (userId, doc) => {
  // Fuck this blows
  // We need routes on both client and server, so we
  // don't have duplicate shitty route logic throughout
  // the app.  Fucking mixpanel get's in the way though
  // of having routes on server.  The fucking import tries
  // to use window.  Typical shitty npm packages.
  //
  // TODO Flow router goes here
  recache(Meteor.absoluteUrl(`profile/${doc.slug}`));
  recache(Meteor.absoluteUrl(`embed/profile/${doc.slug}`));
};

Meteor.users.after.insert(recacheUser);
Meteor.users.after.update(recacheUser);
