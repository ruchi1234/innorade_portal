import { Meteor } from 'meteor/meteor';
import { Match, check } from 'meteor/check';
import _ from 'lodash';

import UserLedgers from '/imports/modules/user_ledgers/user_ledgers';
import UserLedgersBalance from '/imports/modules/user_ledgers/user_ledgers_balance';

import { SyncedCron } from 'meteor/percolate:synced-cron';

// TODO: can this be globalized?  or moved to model?  Mavenx.globals.LIMIT_LIST
const MAX_LIMIT = 50;

const { BALANCE_JOB_SCHEDULE } = Meteor.settings.affUserLedger;

/*
* CHECK LOGIC
*----------------------------------------------------------------------*/

// TODO: would like to move these to a global check / helper
// TODO: update to global check
const allowedFilter = Match.Optional({
  postDate: Match.Optional({
    $lt: Match.Optional(Date),
    $gt: Match.Optional(Date),
  }),
});

const allowedOptions = Match.Optional({
  limit: Match.Optional(Number),
  offset: Match.Optional(Number),
});

/*
* SECURITY(Client-side modification rules)
*----------------------------------------------------------------------*/
// e.g., allow / deny

/*
* PUBLICATIONS
*----------------------------------------------------------------------*/

/*
 * TODO
 * This way of doing publications is deprecated in favor of
 * query helpers
 *
 * Convert to query helpers
 */
Meteor.publish('userLedgersByArgs', function(filter, options) {
  check(filter, allowedFilter);
  check(options, allowedOptions);

  const query = _.extend({}, filter, { userId: this.userId });
  /*
   * Let the user control the limit, but default it to max limit
   * Don't let the client override sort direction though
   */
  const opts = _.extend({ limit: MAX_LIMIT }, options, { sort: { postDate: -1 } });

  return UserLedgers.find(query, opts);
});


Meteor.publish('UserLedgersBalanceById', function() {
  return UserLedgersBalance.find({ userId: this.userId });
});

/*
* FUNCTIONS
*----------------------------------------------------------------------*/

// TODO: could this be more efficient? yes... dirty records?
UserLedgersBalance.recalcAll = () => {
  Meteor.users.find().forEach((u) => {
    let sum = 0;
    const value = UserLedgers.find({ userId: u._id }).forEach((cr) => {
      sum += cr.amount;
    });
    UserLedgersBalance.upsert({ userId: u._id }, { sum, userId: u._id });
  });
};

/*
* METHODS
*----------------------------------------------------------------------*/

/*
* JOBS
*----------------------------------------------------------------------*/
SyncedCron.config({
  log: true,
  utc: false,
});

/*
 * Recalc all commission report sums ever night at 2:30
 */
SyncedCron.add({
  name: 'Re-calculate all current values for commission reports',
  schedule: function(parser) {
    return parser.text(BALANCE_JOB_SCHEDULE);
  },
  job: function() {
    UserLedgersBalance.recalcAll();  // TODO: see functions note
  },
});

SyncedCron.start();
