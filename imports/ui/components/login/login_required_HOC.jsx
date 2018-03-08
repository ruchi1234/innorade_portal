import { Meteor } from 'meteor/meteor';
import React from 'react';
import Login from '/imports/ui/components/login/login';

const LoginRequiredHOC = (Component) => {
  const LoginRequired = React.createClass({
    propTypes: {
      loggedIn: React.PropTypes.bool,
    },

    componentDidMount() {
      if (!this.props.loggedIn) {
        Bert.alert('Please login to continue!', 'danger', 'fixed-top', 'fa-frown-o');
      }
    },

    // FIXME - not sure what or where Component is...
    render() {
      if (!this.props.loggedIn) {
        return (<Login noRedirect />);
      } else {
        return (<Component {...this.props} />);
      }
    },
  });

  // FIXME: what to do about data?
  return MeteorData(LoginRequired, {
    getData() {
      return {
        loggedIn: (!!Meteor.userId()),
      };
    },
  });
};

export default LoginRequiredHOC;
