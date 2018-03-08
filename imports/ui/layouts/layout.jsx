import React from 'react';
import shallowCompare from 'react-addons-shallow-compare';
import BaseLayout from './base_layout';
import HideOnScroll from '/imports/ui/layouts/hide_on_scroll';

import UserBar from '/imports/ui/components/bars/user_bar';
import NavBar from '/imports/ui/components/bars/nav_bar';
import SearchBar from '/imports/ui/components/bars/search_bar';
import VisitorFooter from '/imports/ui/components/visitor_footer';
import MobileNav from '/imports/ui/components/bars/mobile_nav';
import NewUserSplashModal from '/imports/ui/components/layout/new_user_modal';

const Layout = React.createClass({
  displayName: 'layout',

  propTypes: {
    children: React.PropTypes.node.isRequired,
    bar: React.PropTypes.node,
    showSearch: React.PropTypes.bool,
    myType: React.PropTypes.string,
    filters: React.PropTypes.array,
  },

  getDefaultProps() {
    return { showSearch: true };
  },

  shouldComponentUpdate(nextProps, nextState) {
    return shallowCompare(this, nextProps, nextState);
  },

  render() {
    const { showSearch, filters, bar, children } = this.props;
    return (
      <BaseLayout>
        <header role="banner">
          <HideOnScroll>
            <UserBar />
            <NavBar />
            {bar}
            {showSearch &&
              <SearchBar
                filters={filters}
              />
            }
          </HideOnScroll>
        </header>

        <main>
          {children}
        </main>

        <footer>
          <ul className="nav social">
            <li>
              <a href="https://www.facebook.com/MavenX" target="_blank">
                <i className="fa fa-lg fa-facebook"></i>
              </a>
            </li>
            <li>
              <a href="https://twitter.com/MavenXInc" target="_blank">
                <i className="fa fa-lg fa-twitter"></i>
              </a>
            </li>
            <li>
              <a href="https://www.instagram.com/mavenxinc" target="_blank">
                <i className="fa fa-lg fa-instagram"></i>
              </a>
            </li>
            <li>
              <a href="https://www.pinterest.com/MavenX" target="_blank">
                <i className="fa fa-lg fa-pinterest"></i>
              </a>
            </li>
          </ul>
        </footer>

        <NewUserSplashModal />
        <MobileNav />
        <VisitorFooter />
      </BaseLayout>
    );
  },
});

export default Layout;
