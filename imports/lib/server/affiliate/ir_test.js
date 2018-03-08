// var request = require('request');
// var http = require("https");
//
// var irtest = function () {
//   console.log('calling ir');
//
//   // var options = {
//   //   "method": "GET",
//   //   "hostname": "api.impactradius.com",
//   //   "port": null,
//   //   "path": "/Mediapartners/IRGduSaqFRXd404992rP97jzbb6BoFjwh1/Campaigns",
//   //   "headers": {
//   //     "accept": "application/json",
//   //     "authorization": "Basic IRGduSaqFRXd404992rP97jzbb6BoFjwh1:_sqyWXoUPgwbn4e.Cg6kJkczEwUiUaQZl"
//   //   }
//   // }
//   //
//   // var req = http.request(options, function (res) {
//   //   var chunks = [];
//   //
//   //   res.on("data", function (chunk) {
//   //     chunks.push(chunk);
//   //   });
//   //
//   //   res.on("end", function () {
//   //     var body = Buffer.concat(chunks);
//   //     console.log(body.toString());
//   //   });
//   // });
//   //
//   // req.end();
//
//   var options = {
//     method: 'GET',
//     // url: 'https://api.impactradius.com/Mediapartners/IRGduSaqFRXd404992rP97jzbb6BoFjwh1/Campaigns/346',
//     // url: 'https://api.impactradius.com/Mediapartners/IRGduSaqFRXd404992rP97jzbb6BoFjwh1/Reports',
//     // url: 'https://api.impactradius.com/Mediapartners/IRGduSaqFRXd404992rP97jzbb6BoFjwh1/Campaigns',
//     url: 'https://api.impactradius.com/Mediapartners/IRGduSaqFRXd404992rP97jzbb6BoFjwh1/Campaigns/346',
//     'auth': {
//       'user': 'IRGduSaqFRXd404992rP97jzbb6BoFjwh1',
//       'pass': '_sqyWXoUPgwbn4e.Cg6kJkczEwUiUaQZ'
//     }
//   };
//   console.log(encodeURIComponent("https://www.mavenx.com/boards"));
//   request(options, (err, response) => {
//     console.log('err: ', err);
//     console.log('response: ', response.body);
//     console.log('request:', request);
//     return callback();
//   });
// }
//
// module.exports.irtest = irtest;
