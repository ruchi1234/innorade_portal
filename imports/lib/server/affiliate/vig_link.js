import { Meteor } from 'meteor/meteor';
import { check, Match } from 'meteor/check';
import { HTTP } from 'meteor/http';
import { Kadira } from 'meteor/meteorhacks:kadira';

/**
 * file: server.api.viglink.js
 * by: MavenX - tewksbum Mar 2016
 * re: affiliate code for linkshare
 * ref:
/*VigLink documentation:
 format (required):     required; string                For legacy reasons, format must always be provided, even though it only supports a value of txt. This requirement will be removed in a future API version.
 key (required):        required; string                Your VigLink API key, found on your account page.
 loc (required):        required; string; format: URL   The URL to the document containing the link being monetized. For example, if a link from http://example.com to http://amazon.com/dp/0316769487 is being affiliated, loc is http://example.com. An accurate loc value is required in your API call.
 out (required):        required; string; format: URL   The URL to monetize.
 cuid (optional: this will be our huntID):  optional; string; format: up to 32 alphanumeric characters  An ID of your choosing that identifies the clicker, the page the link is on, a campaign or the click itself. See our CUID documentation for details.
 reaf (optional):       optional; boolean; default: false   By default, VigLink will not modify URLs which are already affiliated. To force re-affiliation for a single URL, set reaf to true. If you’d like to force re-affiliation globally, you can make that change in your VigLink settings.
 ref (optional):        optional; string                Short for “referrer”, ref is the URL of the referring document for the current page. Expanding on the example from loc, if the user came from http://othersite.com to get to http://example.com, ref is http://othersite.com.
 title(optional):       optional; string                The HTML title of the page containing the link to out.
 txt (optional):        optional; string                The HTML link text of the link to out.
 */

const getVigLink = (gonkAttributes) => {
  console.log('in VL');
  // check(gonkAttributes, {
  //   url: Match(String),
  //   callback: Match(String),
  // });
  check(gonkAttributes, Object);

  try {
    const response = HTTP.call('GET', 'http://api.viglink.com/api/click',
      { params:
        { format: 'txt',
          key: Meteor.settings.services.viglink.key,
          loc: 'http://www.mavenx.com',
          out: gonkAttributes.url,
          cuid: gonkAttributes.callback,
          reaf: 'true' },
    });
    if (response.statusCode === 200) {
      // console.log('VL response code (200?): ', response.statusCode);
      // console.log('VL response code: ', response.content);
      return response.content;
    } else {
      console.log('VL response non200 code: ', response.statusCode);
      // console.log('VL response code: ', response.content);
      return gonkAttributes.url;
    }
  } catch (err) {
    const type = 'getVigLink';
    const message = err.message;
    Kadira.trackError(type, message);
    console.log('\n\n', message, '\n\n');
  }
};

export { getVigLink };
