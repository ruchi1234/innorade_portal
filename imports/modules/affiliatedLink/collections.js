import { Mongo } from "meteor/mongo";

const AffiliatedLink = new Mongo.Collection('affiliatedLink');

const Schema = new SimpleSchema({
    //Retailer Domain name
    domain: {
      type: String,
      optional: true,
    },
    //Retailer url
    url: {
        type: String,
        optional: true
    },
    // generated Affiliated link for respective Domain name
    affiliated_link: {
      type: String,
      optional: true,
    },
    // user id for which affiliated url is generated
    affiliatedLinkForUserId:{
        type: SimpleSchema.RegEx.Id,
        optional: true
    },
    // on which date affiliated url is generated
    generatedAt: {
        type: Date,
        optional: true
    },
    // affiliated url is for cash Back or Piniterest
    cashBackOrPinUrl: {
        type: Boolean,
        optional: true
    }
});

export { Schema };
AffiliatedLink.attachSchema(Schema);
AffiliatedLink.attachBehaviour('timestampable');

export default AffiliatedLink;

