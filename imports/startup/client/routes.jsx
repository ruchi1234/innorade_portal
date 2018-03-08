/* global utu */
import React from 'react';
import { mount } from 'react-mounter';
import { Meteor } from 'meteor/meteor';
import { _ } from 'meteor/underscore';
import { FlowRouter } from 'meteor/kadira:flow-router';
import { Accounts } from 'meteor/accounts-base';
import { Session } from 'meteor/session';
import { Tracker } from 'meteor/tracker';
import $ from 'jquery';
import updateDochead from '/imports/modules/update_dochead';
import mixpanel from 'mixpanel-browser';

import BlankLayout from '/imports/ui/layouts/blank_layout';
import DetailLayout from '/imports/ui/layouts/detail_layout';
import ListLayout from '/imports/ui/layouts/list_layout';
import BaseLayout from '/imports/ui/layouts/base_layout';

import BoardDetail from '/imports/ui/pages/board_detail';
import BoardsList from '/imports/ui/pages/boards_list';
import BProductDetail from '/imports/ui/pages/bproduct_detail';
import BProductsList from '/imports/ui/pages/bproducts_list';
import Profile from '/imports/ui/pages/profile';
import MyUserLedger from '/imports/ui/pages/my_user_ledger';
import MyBoards from '/imports/ui/pages/my_boards';
import MyProducts from '/imports/ui/pages/my_products';
import MyProductBar from '/imports/ui/components/products/my_product_bar';
import MyBoardBar from '/imports/ui/components/boards/my_board_bar';
import AdBar from '/imports/ui/components/bars/ad_bar';
import ProfileShow from '/imports/ui/pages/profile_show';
import Mavelet from '/imports/ui/pages/mavelet';
import GetMavelet from '/imports/ui/pages/get_mavelet';
import Resetp from '/imports/ui/components/login/resetp';
import AcceptInvite from '/imports/ui/components/share/invite/accept_invite';
import ReferAFriend from '/imports/ui/components/users/refer_a_friend';
import EmbedBoard from '/imports/ui/pages/embed_board';
import EmbedClip from '/imports/ui/pages/embed_clip';
import EmbedProfile from '/imports/ui/pages/embed_profile';
import AffiliateLink from '/imports/ui/pages/affiliate_link';

import PinterestLink from '/imports/ui/pages/pinterest_link';
/*
** file: both.FlowRouter
** by: MavenX - tewksbum Feb 2016
** re: Left in both for now anticipating SSR
** ref:
** https://kadira.io/academy/meteor-routing-guide/content/triggers
** https://kadira.io/academy/meteor-routing-guide/content/subscriptions-and-data-management/with-react
** https://medium.com/@satyavh/using-flow-router-for-authentication-ba7bb2644f42#.90ee6um9h
// https://themeteorchef.com/snippets/using-flow-router-with-react/
*/

// TODO: evaluate passing cards instead of id when navigating from list to
// detail views

/*
** GROUP DEFINITION
*----------------------------------------------------------------------*/
const everyone = FlowRouter.group({
  // prefix: "/everyone"
});

// Reset scroll positino when the route changes
FlowRouter.triggers.enter([() => { $(window).scrollTop(0); }]);

// Reset dochead.  Ideally we should have one of these with
// page specific informatino on every page.  Presently only found
// on product detail and board detail, so we need a general reset for
// other pages.
FlowRouter.triggers.exit([() => { updateDochead(); }]);

// Monkey patch to allow default params for query params
const defaultQParams = {
  filter: 'All',
};
FlowRouter._getQueryParam = FlowRouter.getQueryParam;
FlowRouter.getQueryParam = (key) => {
  return FlowRouter._getQueryParam(key) || defaultQParams[key];
};

// react requires a stateful child, and I want
// to pass params to children
class FlowRouterWrap extends React.Component {
  render() {
    return this.props.children;
  }
}

FlowRouterWrap.propTypes = {
  children: React.PropTypes.node.isRequired,
};

/*
** SYSTEM ROUTES
*----------------------------------------------------------------------*/

FlowRouter.route('/tools/getmavelet', {
  name: 'getmavelet',
  action() {
    mount(DetailLayout, {
      detail: <GetMavelet />,
    });
  },
});

FlowRouter.route('/invite/:token', {
  name: 'invitesAccept',
  action(params) {
    mount(DetailLayout, {
      detail: <AcceptInvite token={params.token} type="board" />,
    });
  },
});

FlowRouter.route('/refer-a-friend', {
  name: 'referAFriend',
  action() {
    mount(DetailLayout, {
      detail: <ReferAFriend />,
    });
  },
});

/*
** route: resetp
** re: opens the p reset form
*/
everyone.route('/resetp/:token', {
  name: 'resetp',
  action(params) {
    if (Accounts._resetPasswordToken) {
      Session.set('resetPasswordToken', params.token);
    }
    mount(BlankLayout, {
      content: <Resetp token={params.token} />,
    });
    mixpanel.track('Reset Password');
    utu.track('Reset Password');
    mixpanel.people.set();
  },
});

/*
** route: logout
** re: explicilty logs someone out and returns to login page
*/

// FIXME: appears this is no longer called?
FlowRouter.route('/logout', {
  name: 'logout',
  action() {
    Meteor.logout(() => {
      FlowRouter.go('boards');
      Bert.alert('Youve been logged out!', 'info', 'fixed-top', 'fa-info');
      mixpanel.track('Logout');
      utu.track('Logout');
      mixpanel.people.set();
    });
  },
});

/*
** route: notFound
*/
FlowRouter.notFound = {
  name: 'notfound',
  action() {
    Bert.alert('The page you requested is not available.  You are being redirected to product' +
    ' directory.', 'warning', 'fixed-top');
    FlowRouter.go('products');
  },
};

/*
** PROFILE ROUTES
*----------------------------------------------------------------------*/

/*
** route: profile
** re: an individuals page.  outside of any personal privacy filters, if userId
** isn't logged in, can't even reach profile.
*/
FlowRouter.route('/profile', {
  name: 'profile',
  action(params) {
    mount(DetailLayout, {
      detail: <Profile usid={Meteor.userId()} />,
    });
  },
});

/*
 ** route: myboards
 ** re: listing of all boards for which user is owner
 */
FlowRouter.route('/profile/:slug', {
  name: 'profile',
  action(params) {
    const _filters = ['All', 'Open', 'Top', 'Favorite'];
    mount(FlowRouterWrap, {
      children: (
        <ListLayout filters={_filters}>
          <ProfileShow slug={params.slug} keyword={params.slug} />
        </ListLayout>
      ),
    });
  },
});
// <ListLayout showSearch={false}>

/*
** route: myuserledger
** re: grouped with profile as it pertains to a specific user.  this is where they
** go to see their commission balance.
*/
FlowRouter.route('/myuserledger', {
  name: 'myuserledger',
  action() {
    mount(DetailLayout, {
      detail: <MyUserLedger />,
    });
  },
});


/*
** FUNCTIONAL ROUTES
*----------------------------------------------------------------------*/

/*
** route: home
** re: direct someone to home...
*/
everyone.route('/', {
  name: 'home',
  action(params, queryParams) {
    FlowRouter.go(FlowRouter.path('boards', params, queryParams));
    // TODO: all default routes should go to myboards
    // if (Meteor.user()) {
    //   FlowRouter.go('myboards');
    // } else {
    //   FlowRouter.go(FlowRouter.path('boards', params, queryParams));
    // }
  },
});

/*
** route: board
** re: a board is a board.  whether someone can access it or not would not be
** route level decision.  Private boards would have to be authenticated, while
** public ones anyone can access.
*/
everyone.route('/board/:_id', {
  name: 'board',
  action(params) {
    mount(DetailLayout, {
      detail: <BoardDetail boardId={params._id} />,
    });
  },
});


/*
** route: boards
** re: listing of all boards that aren't private, aren't the users, and aren't
** invited
*/
everyone.route('/boards', {
  name: 'boards',
  action() {
    const _filters = ['All', 'Open', 'Top', 'Favorite'];
    mount(FlowRouterWrap, {
      children: (
        <ListLayout filters={_filters}>
          <BoardsList />
        </ListLayout>
      ),
    });
  },
});

/*
 ** route: mavelet
 ** re: pop-up used to process scraped content into product
 */
FlowRouter.route('/mavelet', {
  name: 'mavelet',
  action() {
    mount(BaseLayout, { children: <Mavelet /> });
  },
});

/*
 ** route: myboards
 ** re: listing of all boards for which user is owner
 */
FlowRouter.route('/myboards', {
  name: 'myboards',
  action() {
    const bars = (
      <div>
        <AdBar defaultAdUnit="My Boards" />
        <MyBoardBar />
      </div>
    );
    mount(FlowRouterWrap, {
      children: (
        <ListLayout bar={bars} showSearch={false}>
          <MyBoards controller="my" cusr={Meteor.userId()} />
        </ListLayout>
      ),
    });
  },
});

FlowRouter.route('/myproducts', {
  name: 'myproducts',
  action() {
    mount(FlowRouterWrap, {
      children: (
        <ListLayout bar={<MyProductBar />}>
          <MyProducts />
        </ListLayout>
      ),
    });
  },
});

/*
 ** route: products
 ** re: listing of products
 */
everyone.route('/product/:_id', {
  name: 'product',
  action(params) {
    mount(DetailLayout, {
      detail: <BProductDetail bproductId={params._id} />,
    });
  },
});

everyone.route('/products', {
  name: 'products',
  action() {
    const _filters = ['All', 'Favorite'];
    mount(FlowRouterWrap, {
      children: (
        <ListLayout filters={_filters} bar={<AdBar defaultAdUnit="Browse Products" />}>
          <BProductsList />
        </ListLayout>
      ),
    });
  },
});

/*
 ** route: embed boards
 ** re: short list of board
 */
everyone.route('/embed/board/:_id', {
  name: 'embed-board',
  action(params) {
    mount(BlankLayout, {
      content: <EmbedBoard boardId={params._id} />,
    });
  },
});

/*
 ** route: embed products
 ** re: short list of product
 */
everyone.route('/embed/clip/:_id', {
  name: 'embed-clip',
  action(params) {
    mount(BlankLayout, {
      content: <EmbedClip clipId={params._id} />,
    });
  },
});

/*
 ** route: embed boards
 ** re: short list of board
 */
everyone.route('/embed/profile/:slug', {
  name: 'embed-profile',
  action(params) {
    mount(BlankLayout, {
      content: <EmbedProfile slug={params.slug} />,
    });
  },
});

FlowRouter.route('/mixpanel-track', {
  name: 'mixpanelTrack',
  action(params, queryParams) {
    Meteor.call('clips.getCreator', queryParams.clipId || queryParams.productId || '', (err, res) => {
      if (err) {
        window.location = queryParams.url;
      } else {
        // console.log('response: ', res);
        // console.log('creator: ', res.creator);
        // console.log('retailer: ', res.retailer || 'no retailer');
        if (queryParams) {
          utu.track(
            queryParams.mixpanelLabel || 'External Link', {
              clipId: queryParams.clipId || queryParams.productId || 'unknown',
              clipCreator: res && res.creator.userId || 'unknown',
              retailer: queryParams.retailer || res.retailer || 'unknown',
              boardId: queryParams.boardId || res.boardId || 'unknown',
            }
          );
          mixpanel.track(
            queryParams.mixpanelLabel || 'External Link', {
              clipId: queryParams.clipId || queryParams.productId || 'unknown',
              clipCreator: res && res.creator.userId || 'unknown',
              retailer: queryParams.retailer || res.retailer || 'unknown',
              boardId: queryParams.boardId || res.boardId || 'unknown',
            }
          );
        }
        window.location = queryParams.url;
      }
    });
  },
});

FlowRouter.route('/email-track', {
  name: 'emailTrack',
  action(params, queryParams) {
    window.location = queryParams.url;
  },
});

FlowRouter.route('/affiliate',{
  name: 'affiliateUrl',
  action(params,queryParams)
  {
    console.log(queryParams.currentUrl);
    mount(DetailLayout, {
      detail: <AffiliateLink currentDomain= {queryParams.currentUrl} />
    })
    //var afurl = Meteor.call('urlAffilliation');
    //window.location = 'https://www.amazon.com/?tag=viglink21228-2';
  }
});
FlowRouter.route('/pinterestLink',{
  name: 'pinterestLink',
  action(params,queryParams)
  {
    mount(DetailLayout, {
      detail: <PinterestLink />
    })
    //var afurl = Meteor.call('urlAffilliation');
    //window.location = 'https://www.amazon.com/?tag=viglink21228-2';
  }
});

/*
 * Auto route to boards on logout
 */
const whitelist = ['embed-board', 'embed-clip'];
let previousState = false;
Tracker.autorun(() => {
  const currentState = !!Meteor.userId();
  const whitelisted = _.contains(whitelist, FlowRouter.getRouteName());
  if (previousState && !currentState && !whitelisted) {
    FlowRouter.go('boards');
  }
  previousState = currentState;
});
