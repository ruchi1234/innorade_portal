// import { Meteor } from 'meteor/meteor';
import { HTTP } from 'meteor/http';
import Future from 'fibers/future';
import queryString from 'query-string';

/**
* file: server.embedly.js
* by: MavenX - tewksbum Mar 2016
* re: access to 3rd party site we use for image and title scraping.
*///

const mxpGetUser = (mxpdid) => {
// Meteor.methods({
  // mxpGetUser: function(mxpdid) {
  console.log('mixpanel mxpGetUser...');
  console.log('mxpdid: ', mxpdid);

  const future = new Future();

  const mxpEndpoint = 'https://mixpanel.com/api/2.0/jql';
  const skey = 'bd3bf880d43112f21b2dd7dde4969daa:';
  // const params = {
  //   mxpdid: '155d2505874a-03cb3bdaaacfb78-48576d-fa000-155d250587541',
  // };
  const mxpdid2 = '155d2505874a-03cb3bdaaacfb78-48576d-fa000-155d250587541';
  const myScript = `
    function main() {
      return People().filter(
        function(user) {
          return user.distinct_id == '155d2505874a-03cb3bdaaacfb78-48576d-fa000-155d250587541'
        }
      )
    }
  `;
  // const myScript = 'function main(){ return People().fileter(function(user) {return user.distinct_id === "155d2505874a-03cb3bdaaacfb78-48576d-fa000-155d250587541"}) }';
  // const myScript = encodeURI('function main(){ return Events().groupBy(["name"], mixpanel.reducer.count()) }');

  // const myParams = encodeURI('{"from_date":"2016-01-01", "to_date": "2016-01-07"}');
  // const myScript = encodeURI('function main(){ return Events(params).groupBy(["name"], mixpanel.reducer.count()) }');

  console.log('script: ', queryString.stringify(myScript));
  // console.log('script: ', encodeURI(JSON.stringify(myScript)));

  HTTP.post(
    mxpEndpoint, {
      auth: skey,
      // data: {
      //   script: 'some crap data',
      // },
      params: {
        // params: myParams,
        script: queryString.stringify(myScript),
      },
      // headers: {
      //   script: 'some crap headers',
      // },
    }, (e, r) => {
      console.log('e: ', e);
      console.log('r: ', r);
      if (!e) {
        future.return(r);
      } else {
        future.throw(e);
      }
    });

  try {
    console.log('wait');
    return future.wait();
  } catch (err) {
    console.log(err);
    return;
  }
};

export { mxpGetUser };
