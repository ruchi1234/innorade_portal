import { Meteor } from 'meteor/meteor';
import Can from './can';
import { showLogin } from '/imports/ui/components/login/modal';

// Primarily for use in UI
export default ({ action, type, id, handleAction, handleLogin, handleDeny, requireVerified, authDenyMsg }) => {
  if (Meteor.isDevelopment) {
    if (action && type && (!Can[action] || !Can[action][type])) {
      console.error(`Trying to check user auth for action: ${action}, type: ${type} not declared`);
    }
  }

  return (...props) => {
    if (Meteor.userId()) {
      if (!requireVerified || !Meteor.user() || Meteor.user().isVerified()) {
        if (action && type && !Can[action][type](Meteor.userId(), id)) {
          // Show error
          if (handleDeny) {
            handleDeny();
          }
        } else {
          // Allowed run action
          handleAction(...(props || []));
        }
      } else {
        Bert.alert('To complete your registration you must verify your email.  ' +
          'Please check your given inbox for your verification email.', 'danger', 'fixed-top');
      }
    } else {
      // popoup login
      showLogin({ message: authDenyMsg });

      // shouldn't be needed/used anymore
      if (handleLogin) {
        handleLogin();
      }
    }
  };
};
