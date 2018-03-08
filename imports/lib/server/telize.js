import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';
import { Kadira } from 'meteor/meteorhacks:kadira';
import { HTTP } from 'meteor/http';

// https://market.mashape.com/fcambus/telize/

Meteor.methods({

  geoJsonForIp(ip) { // The method expects a valid IPv4 address
    const telizeEndpoint = 'https://telize-v1.p.mashape.com/geoip/';
    const telizeHash = Meteor.settings.services.telize.hash;

    check(ip, String);
    console.log('Method.geoJsonForIp for', ip);

    try {
      const convertAsyncToSync = Meteor.wrapAsync(HTTP.get);
      let response = convertAsyncToSync(
        telizeEndpoint + ip, { headers: {
          'X-Mashape-Key': telizeHash,
          Accept: 'application/json' } }
      );
      if (!response && !response.content) {
        response = {
          offset: '',
          longitude: 0,
          city: 'unknown',
          timezone: 'unknown',
          latitude: 0,
          area_code: '',
          region: 'unknown',
          dma_code: '',
          organization: 'unknown',
          country: 'unknown',
          ip,
          country_code3: '',
          postal_code: '',
          continent_code: '',
          country_code: '',
          region_code: '',
        };
      }
      return JSON.parse(response.content);
    } catch (err) {
      const type = 'telize';
      const message = err.message;
      Kadira.trackError(type, message);
      console.log('\n\n', message, '\n\n');
    }
  },
});
