import { Mongo } from 'meteor/mongo';
import { Meteor } from 'meteor/meteor';

const UserLedgers = new Mongo.Collection('affUserLedger');

const Schema = new SimpleSchema({
  // the $ ammount associated with trx
  amount: {
    type: Number,
    optional: false,
    decimal: true,
  },
  // NOTE: not denorming now... maybe as needed
  // as available, the bid of the related board
  // boardId : {
  //     type: String,
  //     optional: true,
  //     regEx: SimpleSchema.RegEx.Id
  // },
  // should be present on every trx type except a paymant.
  boardProductsId: {
    type: String,
    optional: true,
    regEx: SimpleSchema.RegEx.Id,
  },
  // concatenation of the retailer domain plus trx $ ?
  description: {
    type: String,
    optional: true,
  },
  // unique identifier to the batch run that produced this journal entry.
  jobId: {
    type: String,
    optional: false,
    regEx: SimpleSchema.RegEx.Id,  // we can make this a timestamp if we want
  },
  // this is a reference to the CommissionLedger _id.  This is the fk that
  // ties the ledger detail to the main commission ledger.
  // TODO: if a CommissionLedgerId isn't availabe at the time of insert, or
  // can not subsequently be appended... and we want to maintain some form
  // of referential integrity, we could replace this w/ network - then join
  // the two on a compound key w/ [network, bpid, postdate, ammount, and jobid]
  // and then hope we don't have a repeated trx in the same period.
  commissionLedgerId: {
    type: String,
    optional: true,
    regEx: SimpleSchema.RegEx.Id,
  },
  // NOTE: not denorming now... maybe as needed
  // as available, the pid of the related board
  // productId : {
  //     type: String,
  //     optional: true,
  //     regEx: SimpleSchema.RegEx.Id
  // },
  // timestamp from origin for actual trx
  postDate: {
    type: Date,
    optional: false,
  },
  // type of the trx.   sale, referral's sale, referral's return, payment, return, adjustment
  type: {
    type: String,
    optional: false,
  },
  // user _id of account holder.
  userId: {
    type: String,
    optional: false,
    regEx: SimpleSchema.RegEx.Id,
  },
});

UserLedgers.attachSchema(Schema);
UserLedgers.attachBehaviour('timestampable');

UserLedgers.queryHelpers = {
  dateRange(options) {
    const { startDate, endDate } = options;
    const query = { postDate: {} };

    const postDate = [];
    if (startDate) {
      postDate['$gt'] = startDate.toString();
    }
    if (endDate) {
      postDate['$lt'] = startDate.toString();
    }

    return [query, {}, {}];
  },
};

UserLedgers.helpers({
  isPayment() {
    return this.amount < 0;
  },
});

// TODO: over time, is this the optimal index set?
if (Meteor.isServer) {
  UserLedgers._ensureIndex({
    userId: 1,
    postDate: 1,
  });
  UserLedgers._ensureIndex({
    userId: 1,
    boardProductsId: 1,
    type: 1,
  });
}

export default UserLedgers;
