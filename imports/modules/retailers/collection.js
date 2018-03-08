import { Mongo } from 'meteor/mongo';

const Retailers = new Mongo.Collection('retailers');

const Schema = new SimpleSchema({
  // domain: domain of url
  // it's a partial url - just bestbuy.com
  // regEx: SimpleSchema.RegEx.Url
  domain: {
    type: String,
    optional: true,
  },
  indix_storeId: {
    type: String,
    optional: true,
  },
  // logo: retailers logo
  logo: {
    type: String,
    optional: true,
  },
  // network affiliate network
  network: {
    type: String,
    optional: true,
  },
  // some networks identify their advertisers by id's that are best kept manually.
  networkId: {
    type: String,
    optional: true,
  },
  // notes contributed notes for Maven's eyes only
  // TODO: > read this > maybe at later point upgrade this to a message structure
  notes: {
    type: String,
    optional: true,
    // type: [Object],
    // optional: true,
    // blackbox: true
  },
  // retailer: who is selling item
  retailer: {
    type: String,
    optional: true,
  },
  // retailer411: general information on retailer
  retailer411: {
    type: String,
    optional: true,
  },
  // returnpol: policy
  returnpol: {
    type: String,
    optional: true,
  },
  // shippingpol: policy
  shippingpol: {
    type: String,
    optional: true,
  },
  // status: 0 for open, 1 closed / private, 3 logical delete, 4 orphaned
  status: {
    type: Number,
    optional: true,
  },
  // full url of domain
  url: {
    type: String,
    optional: true,
    //regEx: SimpleSchema.RegEx.Url
  },
  // flag for using full surl instead of chopped version
  aurlType: {
    type: Number,
    optional: true,
    // 0 for chopped, 1 for surl
  },
  // userId: the Id of the user who created the retailer
  userId: {
    type: String,
    optional: true,
    regEx: SimpleSchema.RegEx.Id,
  },
});

export { Schema };

Retailers.attachSchema(Schema);
Retailers.attachBehaviour('timestampable');

export default Retailers;
