import { Meteor } from 'meteor/meteor';
import { HTTP } from 'meteor/http';
import Future from 'fibers/future';

/**
* file: server.embedly.js
* by: MavenX - tewksbum Mar 2016
* re: access to 3rd party site we use for image and title scraping.
*/

const embedlyAPI = (url) => {
  console.log('embdely API...');

  const future = new Future();

  HTTP.get('https://api.embedly.com/1/extract',
    { params: {
      url,
      key: Meteor.settings.services.embedly.apikey } },
  (e, r) => {
    if (!e) {
      future.return(r);
    } else {
      future.throw(e);
    }
  });

  try {
    return future.wait();
  } catch (err) {
    console.log(err);
    return;
  }
};

export { embedlyAPI };
