import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';
import { Random } from 'meteor/random';
import { _ } from 'meteor/underscore';
import Ads from '../../../modules/ads/collection';
import Impressions from '../../../modules/impressions/collection';

const trackImpression = function ({ requestId, adId, type }) {
  Impressions.insert({
    requestId,
    adId,
    type,
    metadata: {
      headers: this.connection && this.connection.httpHeaders,
      userId: Meteor.userId(),
    },
  });
};

Meteor.methods({
  'ads.getAd': function (adUnit, size) {
    console.log('Ad fetch requested', adUnit, size);
    check(adUnit, String);
    check(size, Object);
    const { height, width } = size;
    check(height, Number);
    check(width, Number);

    const ads = Ads.find({
      height,
      width,
      adUnit,
    }).fetch();

    const requestId = Random.id();
    const ad = ads[Math.floor(Math.random() * ads.length)];
    if (!ad) {
      trackImpression.apply(this, [{ requestId, adId: undefined, type: 'request' }]);
      return undefined;
    }
    const ret = _.omit(Object.assign({}, ad, { requestId, adId: ad._id }), '_id');
    trackImpression.apply(this, [{ requestId, adId: ad._id, type: 'request' }]);
    return ret;
  },
  'ads.recordImpression': function (adId, requestId, type) {
    check(requestId, String);
    check(adId, String);
    check(type, String);

    trackImpression.apply(this, [{ requestId, adId, type }]);
  },
});
