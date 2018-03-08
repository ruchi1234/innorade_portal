import { Meteor } from 'meteor/meteor';
import { check, Match } from 'meteor/check';

const getShareASale = (gonkAttributes, networkId) => {
  console.log('in SS');

  check(gonkAttributes, Object);
  check(networkId, String);

  // http://www.shareasale.com/r.cfm?u=1184573&b=922071&m=68182&afftrack=pid%3D12345&urllink=www%2Ebloomthat%2Ecom%2Fflowers%2Fthe%2Dmatilda

  let response = gonkAttributes.url;
  const id = Meteor.settings.services.shareasale.id;  // THIS IS OUR LINKSHARE ID
  const mid = networkId;  // NEED TO PULL THIS FROM A DATABASE OF RETAILERS)
  const murl = encodeURIComponent(gonkAttributes.url).replace("http%3A%2F%2F", "");   // THIS IS THE URL THE MAVEN SUBMITS
  const u1 = gonkAttributes.callback;  // THIS WILL BE OUR encoded tracking callback

  // console.log('u1: ', u1);
  // console.log('murl: ', murl);

  if (mid) {
    response = `http://www.shareasale.com/r.cfm?u=${id}&b=585823&m=${mid}&afftrack=${u1}&urllink=${murl}`;
  }

  // console.log('SS');
  console.log(response);
  return response;  // we shouldn't need to return encodeURI()
};

export { getShareASale };
