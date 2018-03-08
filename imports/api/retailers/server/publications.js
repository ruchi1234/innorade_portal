import { Meteor } from 'meteor/meteor';
import Retailers from '/imports/modules/retailers/collection';

Meteor.publish('retailers', function() {
  return Retailers.find();
});
