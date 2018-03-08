import React from 'react';
import { Meteor } from 'meteor/meteor';
import { ReactMeteorData } from 'meteor/react-meteor-data';

import FlowHelpers from '/imports/startup/flow_helpers';
import { FlowRouter } from 'meteor/kadira:flow-router';
import canHOF from '/imports/modules/can/can_hof';
import Img from '/imports/ui/components/img.jsx';
import CategoriesDropdown from '/imports/ui/components/bars/categories_dropdown.jsx';

const handleRAF = canHOF({
  action: 'raf',
  authDenyMsg: 'You must be logged in to refer a friend',
  handleAction: () => FlowRouter.go('referAFriend'),
});

const NavMenu = ({ currentRoute }) => (
  <div className="navbar-wrapper" onClick={this.onClickToggleNav}>
    <ul className="nav navbar-nav">
      <li
        className={`${(currentRoute === 'boards') ? 'active' : ''}`}
      >
        <a href={FlowHelpers.pathFor('boards', {})} >
          <span>Boards</span>
        </a>
      </li>
      <li
        className={`dropdown ${(currentRoute === 'products') ? 'active' : ''}`}
      >
        <a data-toggle="dropdown" className="dropdown-toggle" href="#">
          Products
          <span className="carat"></span>
        </a>
        <CategoriesDropdown />
      </li>
    </ul>
    <ul className="nav navbar-nav navbar-right">
      <li className={currentRoute === 'myboards' ? 'active' : ''}>
        <a href={FlowRouter.path('myboards')}>
          <span>My Boards</span>
        </a>
      </li>
      <li className="dropdown">
        <a data-toggle="dropdown" className="dropdown-toggle" href="#">
          Tools
          <span className="carat"></span>
        </a>
        <ul role="menu" className="dropdown-menu">
          <li>
            <a href={FlowRouter.path('myuserledger')} >
              Dashboard
            </a>
          </li>
          <li>
            <a href={FlowRouter.path('getmavelet')} >
              <span>Get Mavelet</span>
            </a>
          </li>
          <li>
            <a onClick={handleRAF} >
              <span>Refer a friend</span>
            </a>
          </li>
          <li>
            <a href="http://about.mavenx.com/maven-retail-network/" target="_blank">
              <span>Retailers</span>
            </a>
          </li>
          <li>
            <a href="http://blog.mavenx.com/category/use-mavenx-com/" target="_blank">
              <span>Learning Center</span>
            </a>
          </li>
        </ul>
      </li>
      <li className="dropdown">
        <a data-toggle="dropdown" className="dropdown-toggle" href="#">
          About us
          <span className="carat"></span>
        </a>
        <ul role="menu" className="dropdown-menu">
          <li>
            <a href="http://about.mavenx.com/" target="_blank">
              <span>Why Maven</span>
            </a>
          </li>
          <li>
            <a href="http://about.mavenx.com/new-to-maven/" target="_blank">
              <span>FAQ</span>
            </a>
          </li>
          <li>
            <a href="http://blog.mavenx.com/" target="_blank">
              <span>Blog</span>
            </a>
          </li>
          <li>
            <a href="http://about.mavenx.com/terms-of-service/" target="_blank">
              <span>Legal</span>
            </a>
          </li>
          <li>
            <a href="http://about.mavenx.com/contact/" target="_blank">
              <span>Contact</span>
            </a>
          </li>
        </ul>
      </li>
    </ul>
  </div>
);

NavMenu.propTypes = {
  onAction: React.PropTypes.func,
  loggedIn: React.PropTypes.bool,
  currentRoute: React.PropTypes.string,
};

const NavBar = React.createClass({
  mixins: [ReactMeteorData],

  getInitialState() {
    return { mobileMenuOpen: false };
  },

  onClickToggleNav(e) {
    e.preventDefault();
    const { mobileMenuOpen } = this.state;
    this.setState({ mobileMenuOpen: !mobileMenuOpen });
  },

  onMenuStateChange(s) {
    this.setState({ mobileMenuOpen: s.isOpen });
  },

  getMeteorData() {
    return {
      currentRoute: FlowRouter.current().route.name,
      loggedIn: !!Meteor.userId(),
    };
  },

  render() {
    const { mobileMenuOpen } = this.state;
    const { currentRoute, loggedIn } = this.data;

    const hamburger = (
      <div className="mobile-menu-button">
        <button
          onClick={() => Session.set('mobile-nav-open', true)}
          type="button"
          className="navbar-toggle collapsed"
        >
          <span className="sr-only">Toggle navigation</span>
          <span className="icon-bar"></span>
          <span className="icon-bar"></span>
          <span className="icon-bar"></span>
        </button>
      </div>
    );

    return (
      <div className="navbar-bg">
        <nav id="navbar" className="navbar navbar-default container">
          <div className="navbar-header">
            <a href="/" className="navbar-brand logo">
              <Img
                src="/img/maven/maven_logo.svg"
                alt="Maven logo"
              />
              <span className="sr-only">
                <maven>Exchange</maven>
              </span>
            </a>
            {hamburger}
          </div>

          <div id="main-navigation" className="collapse navbar-collapse">
            <NavMenu currentRoute={currentRoute} loggedIn={loggedIn} />
          </div>
        </nav>
      </div>
    );
  },
});

export default NavBar;
