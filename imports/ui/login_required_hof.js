import { Meteor } from 'meteor/meteor';

export default (warning, func) => function requireLogin(...props) {
  if (Meteor.userId()) {
    func(...props);
  } else {
    Bert.alert(warning, 'info', 'fixed-top', 'fa-info');
  }
};
