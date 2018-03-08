import { Meteor } from 'meteor/meteor';
import { check, Match } from 'meteor/check';

/**
 * file: server.api.link_share.js
 * by: MavenX - tewksbum Mar 2016
 * re: affiliate code for linkshare
 * ref:
 * https://pubhelp.rakutenmarketing.com/hc/en-us/articles/201105906-Deep-Linking-Structure-Creating-Tracking-Links-Outside-the-Publisher-Dashboard
 * https://pubhelp.rakutenmarketing.com/hc/en-us/articles/201002376-Advertisers-Enabled-for-Deep-Links
 * https://developers.rakutenmarketing.com/subscribe/
 * http://click.linksynergy.com/fs-bin/click?id=C*xXRSCZu*Q&subid=&offerid=411036.1&type=10&tmpid=13127&u1=myHuntID&RD_PARM1=http%253A%252F%252Fwww.bestbuy.com%252Fsite%252Fhp-spectre-x360-2-in-1-13-3-touch-screen-laptop-intel-core-i5-8gb-memory-256gb-solid-state-drive-natural-silver%252F4334200.p%253Fid%253D1219732370998%2526skuId%253D4334200
 */

const getLinkShare = (gonkAttributes, networkId) => {
  console.log('in LS');

  // check(gonkAttributes, {
  //   url: Match(String),
  //   callback: Match(String),
  // });
  check(gonkAttributes, Object);
  check(networkId, String);

  let response = gonkAttributes.url;
  const id = Meteor.settings.services.linkshare.id;  // THIS IS OUR LINKSHARE ID
  const mid = networkId;  // NEED TO PULL THIS FROM A DATABASE OF RETAILERS)
  const murl = encodeURIComponent(gonkAttributes.url);   // THIS IS THE URL THE MAVEN SUBMITS
  const u1 = gonkAttributes.callback;  // THIS WILL BE OUR encoded tracking callback

  if (mid) {
    // response =  "http://click.linksynergy.com/deeplink?" + "id=" + id + "&mid=" + mid + "&murl=" + murl + "&u1=" + u1;
    response = `http://click.linksynergy.com/deeplink?id=${id}&mid=${mid}&u1=${u1}&murl=${murl}`;
  }

  console.log('LS');
  console.log(response);

  return response;  // we shouldn't need to return encodeURI()
};

export { getLinkShare };
