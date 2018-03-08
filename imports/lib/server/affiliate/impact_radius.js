import { Meteor } from 'meteor/meteor';
import { check, Match } from 'meteor/check';
import { HTTP } from 'meteor/http';
import { Kadira } from 'meteor/meteorhacks:kadira';
var request = require('request');

/**
 ... url? ... (req.:    required; string     campaign http from IR
 sudId1 (required):     required; string     will be our ClipId
 u (required):          required; string;    url of target destination
 https://developer.impactradius.com/docs/apis/media-partners/versions/8/resources/campaigns/endpoints/retrieve-a-campaign
 */

// AccountSID > props IRGduSaqFRXd404992rP97jzbb6BoFjwh1
// auth t > _sqyWXoUPgwbn4e.Cg6kJkczEwUiUaQZ
// read only SID > IRTmFXLcL9Ke404992UEHWqGAabUBAUeL1
// read only t > km7yVwQcvxHrFW.jDM8ZqEzbUR_PTUvT
// http://sdz.ojrq.net/c/404992/4098/346
// https://IRTmFXLcL9Ke404992UEHWqGAabUBAUeL1:km7yVwQcvxHrFW.jDM8ZqEzbUR_PTUvT@api.impactradius.com/Mediapartners/IRTmFXLcL9Ke404992UEHWqGAabUBAUeL1/Campaigns/346
// https://IRGduSaqFRXd404992rP97jzbb6BoFjwh1:_sqyWXoUPgwbn4e.Cg6kJkczEwUiUaQZ@api.impactradius.com/Mediapartners/IRGduSaqFRXd404992rP97jzbb6BoFjwh1/Campaigns/346
 //scentbird.7eer.net/c/404992/216613/3773?subId1=sub1&u=www.yahoo.com

http://sdz.ojrq.net/c/404992/4098/346?subId1=kimmons&u=https%3A%2F%2Fwww.mavenx.com%2Fboards

const getImpactRadius = (gonkAttributes, networkId) => {
  console.log('in IR');

  check(gonkAttributes, Object);

  let response = 'http:<<IRCAMP>>?subId1=<<BPID>>&u=<<ENCODEDURL>>';

  response = response.replace('<<IRCAMP>>', networkId);
  response = response.replace('<<BPID>>', gonkAttributes.callback);
  response = response.replace('<<ENCODEDURL>>', encodeURIComponent(gonkAttributes.url));

  return response;

  // try {
  //
  //   var options = {
  //     method: 'GET',
  //     port: null,
  //     url: 'https://' +
  //          env.impactradius.mpid + ':' +
  //          env.impactradius.mptoken + '@' +
  //          'api.impactradius.com/Mediapartners/' +
  //          env.impactradius.mpid +
  //          '/Campaigns/' +
  //          networkId,
  //     headers: {
  //       'accept': 'application/json',
  //       'authorization': 'Basic QWxhZGRpbjpPcGVuU2VzYW1l',
  //       'host': 'api.impactradius.com',
  //     },
  //   };
  //
  //   request(options, (err, resp) => {
  //     if (resp.statusCode === 200) {
  //       response = response.replace('<<IRCAMP>>', resp.body.TrackingLink);
  //       return response;
  //     } else {
  //       console.log('IR response non200 code: ', resp.statusCode);
  //       return gonkAttributes.url;
  //     }
  //   }
  // } catch (err) {
  //   const type = 'getIRLink';
  //   const message = err.message;
  //   // Kadira.trackError(type, message);
  //   console.log('\n\n', message, '\n\n');
  //   return gonkAttributes.url
  // }

};

export { getImpactRadius };
