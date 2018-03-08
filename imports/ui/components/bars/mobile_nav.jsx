import React from 'react';
import { FlowRouter } from 'meteor/kadira:flow-router';
import { composeWithTracker, composeAll } from 'react-komposer';
import { Session } from 'meteor/session';
import UserBar from '/imports/ui/components/bars/user_bar';
import Subscriptions from '/imports/data/subscriptions';
import Categories from '/imports/modules/categories/collection.js';

import loginData from '/imports/data/users/login_state';
import routeData from '/imports/data/misc/route';

const openSubnavHOF = (subnav) => () => Session.set('mobile-nav-subnav', subnav);
const handleClose = () => {
  Session.set('mobile-nav-open', false);
  Session.set('mobile-nav-subnav', undefined);
};

const Item = ({ label, onClick, active, href, openNewWindow }) => (
  <li className={`item ${active ? 'active' : ''}`}>
    <a
      onClick={() => {
        onClick();
        if (!openNewWindow) {
          FlowRouter.go(href);
        } else {
          window.open(href);
        }
      }}
    >
      <span>{label}</span>
    </a>
  </li>
);

Item.propTypes = {
  label: React.PropTypes.string.isRequired,
  onClick: React.PropTypes.func,
  active: React.PropTypes.bool,
  href: React.PropTypes.string.isRequired,
  target: React.PropTypes.string,
  openNewWindow: React.PropTypes.bool,
};

const SubMenu = ({ label, active, showChildren, children, onClick, handleBack }) => (
  <li
    className={`item sub-menu ${active ? 'active' : ''}`}
  >
    {showChildren ?
      <ul>
        <li className="back active item">
          <a onClick={handleBack}>
            <span>{label}</span>
            <div className="back-btn">
              <span className="fa fa-chevron-left"></span>
              &nbsp;Back
            </div>
          </a>
        </li>
        {children}
      </ul> :
      <a onClick={onClick}>
        <span>
          {label}
        </span>
        <div className="arrow-right" />
      </a>
    }
  </li>
);

SubMenu.propTypes = {
  label: React.PropTypes.string.isRequired,
  active: React.PropTypes.bool,
  showChildren: React.PropTypes.bool.isRequired,
  children: React.PropTypes.node.isRequired,
  onClick: React.PropTypes.func.isRequired,
  handleBack: React.PropTypes.func.isRequired,
};

const BrandBar = () => (
  <div className="navbar-bg">
    <nav className="navbar navbar-default container brand-bar">
      <div className="navbar-header">
        <a href="/" className="navbar-brand logo">
          <img
            src="/img/maven/maven_logo.svg"
            onError={function onError() { this.src = 'img/maven_logo.png'; }}
            alt="Maven brand"
          />
          <span className="sr-only">
            <maven>Exchange</maven>
          </span>
        </a>
        <i
          className="ion-ios-close-empty"
          aria-hidden="true"
          onClick={handleClose}
        ></i>
      </div>
    </nav>
  </div>
);

/*
 * Products -> select Categories section
 */
let ProductsSubmenu = ({ categories, routeName, subnav }) => (
  <SubMenu
    label="Products"
    active={(routeName === 'products')}
    showChildren={subnav === 'products'}
    onClick={openSubnavHOF('products')}
    handleBack={openSubnavHOF(undefined)}
  >
    {_.map(categories, (c) => (
      <Item
        key={c.label}
        label={c.label}
        href={c.path}
        active={c.active}
        onClick={handleClose}
      />
    ))}
  </SubMenu>
);

const categoryPath = (category) => {
  const current = FlowRouter.current();
  return FlowRouter.path('products', current.params, _.extend({}, current.queryParams, { category: category && encodeURIComponent(category) }));
};

ProductsSubmenu = composeWithTracker((props, onData) => {
  Subscriptions.subscribe('categories');
  const categories = Categories.find({}, { sort: { order: 1 } }).map((c) => {
    return {
      label: c.title,
      path: categoryPath(c.title),
      active: (c.title === FlowRouter.getQueryParam('category')),
    };
  });

  categories.unshift({ label: 'All Categories', path: categoryPath(undefined), active: !FlowRouter.getQueryParam('category') });

  onData(null, { categories });
})(ProductsSubmenu);

/**
 * Bring it together
*/
const MobileNav = ({ loggedIn, routeName, open, subnav }) => (
  <div
    className={`mobile-nav ${open ? 'open' : ''}`}
    onClick={this.onClickToggleNav}
    role="banner"
  >
    <UserBar />
    <BrandBar handleClose={handleClose} />
    <div className="container">
      <ul>
        <Item
          label="Boards"
          href={FlowRouter.path('boards')}
          active={routeName === 'boards'}
          onClick={handleClose}
        />
        <ProductsSubmenu
          openSubnavHOF={openSubnavHOF}
          routeName={routeName}
          subnav={subnav}
          handleClose={handleClose}
        />
        <Item
          label="My Boards"
          href={FlowRouter.path('myboards')}
          active={routeName === 'myboards'}
          onClick={handleClose}
        />
        <SubMenu
          label="Tools"
          active={(routeName === 'referAFriend' || routeName === 'referAFriend')}
          showChildren={subnav === 'tools'}
          onClick={openSubnavHOF('tools')}
          handleBack={openSubnavHOF(undefined)}
        >
          <Item
            label="Dashboard"
            href={FlowRouter.path('myuserledger')}
            active={routeName === 'myuserledger'}
            onClick={handleClose}
          />
          <Item
            label="Refer a Friend"
            href={FlowRouter.path('referAFriend')}
            active={routeName === 'referAFriend'}
            onClick={handleClose}
          />
          <Item
            label="Learning Center"
            href="http://blog.mavenx.com/category/use-mavenx-com/"
            openNewWindow
            onClick={handleClose}
          />
          <Item
            label="Retailers"
            href="http://about.mavenx.com/maven-retail-network/"
            openNewWindow
            onClick={handleClose}
          />
        </SubMenu>
        <SubMenu
          label="About Us"
          onClick={openSubnavHOF('about-us')}
          handleBack={openSubnavHOF(undefined)}
          showChildren={subnav === 'about-us'}
        >
          <Item
            label="Why Maven"
            href="http://about.mavenx.com/"
            openNewWindow
            onClick={handleClose}
          />
          <Item
            label="FAQ"
            href="http://about.mavenx.com/new-to-maven/"
            openNewWindow
            onClick={handleClose}
          />
          <Item
            label="Blog"
            href="http://blog.mavenx.com/"
            openNewWindow
            onClick={handleClose}
          />
          <Item
            href="http://about.mavenx.com/terms-of-service/"
            openNewWindow
            onClick={handleClose}
            label="Legal"
          />
          <Item
            label="Contact"
            href="http://about.mavenx.com/contact/"
            openNewWindow
            onClick={handleClose}
          />
        </SubMenu>
      </ul>
    </div>
  </div>
);

// Would prefer to use event horizon
Session.setDefault('mobile-nav-open', false);
export default composeAll(
  composeWithTracker((props, onData) => {
    onData(null, {
      open: Session.get('mobile-nav-open'),
      subnav: Session.get('mobile-nav-subnav'),
    });
  }),
  composeWithTracker(loginData),
  composeWithTracker(routeData)
)(MobileNav);
