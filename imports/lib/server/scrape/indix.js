import { Meteor } from 'meteor/meteor';
import Future from 'fibers/future';
import { HTTP } from 'meteor/http';
import { Kadira } from 'meteor/meteorhacks:kadira';

/**
* file: server.api.indix.jsx
* by: MavenX - tewksbum Mar 2016
* re: code to extract product information from Indix via http api calls
* ref:
* https://api.indix.com/v2/offersPremium/products?countryCode=US&url=http%3A%2F%2Fwww1.macys.com%2Fshop%2Fproduct%2Fhelena-5-piece-comforter-duvet-set%3FID%3D2484963%26CategoryID%3D25045%23fn%3Dsp%253D1%2526spc%253D247%2526ruleId%253D%2526slotId%253D1&app_id=eaf2ca40&app_key=886d960c65fee10f4c66b93811549c4e
*/

const indixProductLookup = (url) => {
  console.log('calling indixProductLookup...');
  // const cusr = Meteor.user();

  // Future = Npm.require('fibers/future');
  const myFuture = new Future();

  HTTP.get('https://api.indix.com/v2/offersPremium/products', {
    params: {
      url,
      countryCode: 'US',
      app_id: Meteor.settings.services.indix.appId,
      app_key: Meteor.settings.services.indix.key } },
    (e, r) => {
      // console.log('find product');
      // console.log(e);
      // console.log(r);
      if (!e) {
        myFuture.return(JSON.parse(r.content).result);
      } else {
        myFuture.return(false);
      }
    }
  );

  try {
    return myFuture.wait();
  } catch (err) {
    const type = 'indixProductLookup';
    const message = err.message;
    Kadira.trackError(type, message);
    console.log('\n\n', message, '\n\n');
    myFuture.return(null);
  }
};

export { indixProductLookup };

const indixStoreLookUp = (domain) => {
  // const cusr = Meteor.user();
  const myFuture = new Future();

  HTTP.get('https://api.indix.com/v2/stores', {
    params: {
      q: domain,
      app_id: Meteor.settings.services.indix.appId,
      app_key: Meteor.settings.services.indix.key } },
      (e, r) => {
        console.log('find store');
        // console.log(e);
        // console.log(r);
        if (!e) {
          const obj = JSON.parse(r.content);
          // console.log(obj);
          if (typeof obj.result !== 'undefined') {
            // console.log(obj.result);
            if (typeof obj.result.stores !== 'undefined') {
              if (obj.result.stores.length > 0) {
                myFuture.return(obj.result.stores[0].id);
              } else {
                  // console.log("returning null...");
                myFuture.return(null);
              }
            } else {
              // console.log("returning null...");
              myFuture.return(null);
            }
          } else {
            // console.log("returning null...");
            myFuture.return(null);
          }
        } else {
          myFuture.throw(e);
        }
      });
  try {
    return myFuture.wait();
  } catch (err) {
    const type = 'indixStoreLookUp';
    const message = err.message;
    Kadira.trackError(type, message);
    console.log('\n\n', message, '\n\n');
    myFuture.return(null);
  }
};

export { indixStoreLookUp };
