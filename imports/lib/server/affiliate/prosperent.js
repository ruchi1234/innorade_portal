import { Meteor } from 'meteor/meteor';
import { check, Match } from 'meteor/check';
import { HTTP } from 'meteor/http';
import { Kadira } from 'meteor/meteorhacks:kadira';

/**
 * file: server.api.Prosperent.js
 * by: MavenX - tewksbum Mar 2016
 * re: affiliate code for linkshare
 * ref:
 apiKey:	                        required	string		Key that authorizes access to the data. Log in to view yours.
 url:	                            required	string	    http%3A%2F%2Fmerchant.com%2Fpage	The url encoded merchant URL that is redirected to. For best results, use this param at the end of the redirect url (see below for example).
 location:	                        required	string	    http%3A%2F%2Fmydomain.com%2Fmypage	The encoded url from which the API request is made. If this is a mobile app, please use the website of the mobile app.
 httpHost:	                        optional	string		Same as location
 referrer:	                        optional	string	    http%3A%2F%2Fsearchengine.com%2Fsearch	The encoded url from which the traffic came. Refer to the documentation of the programming language you are using for more information on retrieving the referrer url.
 sid (this will be our huntID):     optional	string		The sub-id to track a site's purchase through.
 format:	                        optional	string	    text, json or jsonp	The format of the returned data. Only permitted in the Request URL, otherwise ignored.
 callback:	                        optional	string		The name of the callback function for jsonp formats. Only permitted in the Request URL with jsonp format specified, otherwise ignored.
 */

const getProsperentLink = (gonkAttributes) => {
  console.log('P: ');
  // check(gonkAttributes, {
  //   url: Match(String),
  //   callback: Match(String),
  // });
  check(gonkAttributes, Object);

  try {
    const response = HTTP.call('GET', 'http://prosperent.com/api/linkaffiliator/url', {
      params: {
        apiKey: Meteor.settings.services.prosperent.apikey,
        location: 'http://www.mavenx.com',
        sid: gonkAttributes.callback,
        format: 'text',
        url: gonkAttributes.url,
      },
    });
    if (response.statusCode === 200) {
      return encodeURI(response.content);
    } else {
      return gonkAttributes.url;
    }
  } catch (err) {
    const type = 'getProsperentLink';
    const message = err.message;
    Kadira.trackError(type, message);
    console.log('\n\n', message, '\n\n');
  }
};

export { getProsperentLink };
