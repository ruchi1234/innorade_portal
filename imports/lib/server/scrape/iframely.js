import { Meteor } from 'meteor/meteor';
import { HTTP } from 'meteor/http';
import { Kadira } from 'meteor/meteorhacks:kadira';
import Future from 'fibers/future';
// import { check } from 'meteor/check';

/**
 * file: server.iframely.js
 * by: MavenX - tewksbum Mar 2016
 * re: access to 3rd party site we use for image and title scraping.
 */

// oembedWidget = 'iframelyBaseWidget';
// var key = 'iframely:oembed:url:';
// var urlRe = /^https?:\/\/[^ \/,"]+\/[^ ,"]+$/i;
// -----------------------------------------------------------------------------------------------//
// run the following on Meteor startup.
// can be transitioned to JSON config files, instead of in main.js
// iframely
// >> http://iframe.ly/api/iframely?url=… &api_key= …
// IframelyOembed.setTemplate('customWidget');
// IframelyOembed.setEndpoint('http://iframe.ly/api/oembed?api_key=445e79d6ba9308d03a5737');
// IframelyOembed.setEndpoint('http://iframe.ly/api/iframely?api_key=445e79d6ba9308d03a5737');
// -----------------------------------------------------------------------------------------------//


// const IframelyOembed = {
//   setEndpoint(url) {
//     if (Meteor.isServer) {
//       const oembedEndpoint = url;
//     }
//   },
//
//   setTemplate(template) {
//     if (Meteor.isClient) {
//       const oembedWidget = template;
//     }
//   },
//
//   setCacheOptions(options) {
//     const cacheTTL = options && options.cacheTTL || cacheTTL;
//     const cacheErrorTTL = options && options.cacheErrorTTL || cacheErrorTTL;
//     const cacheEnabled = options && options.cacheEnabled || cacheEnabled;
//   },
//
// };

const iframelyAPI = (url) => {
  console.log('calling iframelyAPI...');

  const future = new Future();

  HTTP.get('http://iframe.ly/api/iframely', {
    params: {
      api_key: Meteor.settings.services.iframely.apikey,
      url,
      origin: 'maven' } },
      (e, r) => {
        if (!e) {
          future.return(r && r.data);
        } else {
          future.throw(e);
        }
      });
  try {
    return future.wait();
  } catch (err) {
    const type = 'iframelyAPI';
    const message = err.message;
    Kadira.trackError(type, message);
    console.log('\n\n', message, '\n\n');
  }
};

export { iframelyAPI };


const iframelyRender = (oembed) => {
  let bod = '';
  let head = '';
  let desc = '';
  let response = '';

  console.log('here is the response we r trying to parse');
  console.log(oembed);

  if (typeof oembed.html !== 'undefined') {
      // console.log("trying to write html");
    bod = oembed.html + "<br>";
    // console.log(bod);
  }

  if (typeof oembed.title !== 'undefined') {
    head = head + "<b>title: </b>" + oembed.title + "<br>";
  } else {
    if (typeof oembed.meta.title !== 'undefined') {
        // console.log("trying to write title");
      head = head + "<b>title: </b>" + oembed.meta.title + "<br>";
    }
  }

  if (typeof oembed.meta.site !== 'undefined') {
    head = head + "<b>site: </b>" + oembed.meta.site + "<br>";
  }

  if (typeof oembed.meta.description !== 'undefined') {
    desc = desc + "<b>description: </b>" + oembed.meta.description;
  }

  // console.log("head: " + head);
  // console.log("desc: " + desc);
  // console.log("bod: " + bod);

  const n = bod.indexOf('href');
  if (n > 0) {
    response = "<a href='" + oembed.url  + "' target='_blank'>" + head + desc + "</a>";
  } else {
    response = "<a href='" + oembed.url  + "' target='_blank'>" + bod + head + desc + "</a>";
  }

  return response;
};

export { iframelyRender };

// Meteor.methods({
//
//   /**
//    * scrape from the client
//    * @param {String} url
//    * @returns {String} response
//    */
//   clientIframelyScrape(url) {
//     console.log('clientIframelyScrape...');
//
//     check(Meteor.userId(), String);
//     check(url, String);
//
//     let response = url;
//     const _lookup = iframelyAPI(url);
//
//     // will only have html if of that type...
//     if (_lookup.html) {
//       const srcStart = _lookup.html.indexOf('>') + 1;
//       response = _lookup.html.substring(srcStart, _lookup.html.length - 6);
//       // takeoff </div> off the end
//     }
//     return response;
//   },
//
//   // export { clientIframelyScrape };
//
// });
