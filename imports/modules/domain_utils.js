// import { Meteor } from 'meteor/meteor';
import { Kadira } from 'meteor/meteorhacks:kadira';
import Url from 'url';

const extractDomain = (url) => {
  let domain = '';

  // url.parse(urlStr, [parseQueryString], [slashesDenoteHost])
  // console.log('myUrl: ', myUrl);
  // console.log('host: ', myUrl.host);

  try {
    if (url) {
      const hostname = Url.parse(url, true).hostname;
      let parts = 0;
      let pos = hostname.indexOf('.');

      while (pos !== -1) {
        parts++;
        pos = hostname.indexOf('.', pos + 1);
      }

      if (parts === 1) {
        // hostname w/ only one "." - e.g., adidas.com
        domain = hostname;
      } else {
        // in all other cases, drop the first part
        const i = hostname.indexOf('.');
        domain = hostname.substring(i + 1, hostname.length);
      }
    }
  } catch (err) {
    const type = 'extractDomain';
    const message = err.message;
    Kadira.trackError(type, message);
    console.log('\n\n', message, '\n\n');
  } finally {
    console.log('util domain: ', domain);
    return domain;
  }
};

export { extractDomain };

/**
 * Mavenx.both.isURL
 * @param {string} s
 * @returns {boolean} s
 */
// const urlRegx = /^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/;
// const urlRegx = /[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/g;
export const isURL = (testString) => {
  // console.log('testString', testString);
  // return (urlRegx.test(testString));
  return (testString.substring(0, 4) === 'http');
};

/**
 * Mavenx.both.RegExp.escape
 * @param {string} s
 * @returns {string} s
 */
const escapeRegExp = (s) => { s.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&'); };
export { escapeRegExp };
