import { Meteor } from 'meteor/meteor';
// import { Tracker } from 'meteor/tracker';
// import { FlowRouter } from 'meteor/kadira:flow-router';

Meteor.startup(function () {
  Meteor.subscribe('userData');
});

// Meteor.startup(function () {
//   Tracker.autorun(() => {
//     if (FlowRouter.getQueryParam('register')) {
//       showRegisterForm();
//     }
//   });
// });
