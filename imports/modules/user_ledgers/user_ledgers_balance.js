import { Mongo } from 'meteor/mongo';

const UserLedgersBalance = new Mongo.Collection('affUserLedger.balance');

export default UserLedgersBalance;
