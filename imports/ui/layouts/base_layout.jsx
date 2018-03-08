import React from 'react';
import { Meteor } from 'meteor/meteor';
import shallowCompare from 'react-addons-shallow-compare';

import IEAlertModal from '/imports/ui/components/ie_alert_modal';

const Layout = React.createClass({
  displayName: 'layout',

  propTypes: {
    children: React.PropTypes.node.isRequired,
  },

  childContextTypes: {
    loginRequiredHOF: React.PropTypes.func.isRequired,
  },

  getDefaultProps() {
    return {
      showSearch: true,
    };
  },

  getChildContext() {
    return {
      loginRequiredHOF: this.loginRequiredHOF,
    };
  },

  shouldComponentUpdate(nextProps, nextState) {
    return shallowCompare(this, nextProps, nextState);
  },

  loginRequiredHOF(warning, func) {
    const self = this;
    return function requireLogin(...props) {
      if (Meteor.userId()) {
        func(...props);
      } else {
        Bert.alert(warning, 'info', 'fixed-top', 'fa-info');
        self.showLogin();
      }
    };
  },

  render() {
    return (
      <div id="wrapper">
        {this.props.children}
        <IEAlertModal ref="ieAlertModal" />
      </div>
    );
  },
});

export default Layout;
