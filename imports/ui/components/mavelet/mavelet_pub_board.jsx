import React from 'react';
import ReactDOM from 'react-dom';
import { Meteor } from 'meteor/meteor';
import shallowCompare from 'react-addons-shallow-compare';
import { Accounts } from 'meteor/accounts-base';
import { ReactMeteorData } from 'meteor/react-meteor-data';
import _ from 'lodash';
import $ from 'jquery';

import Row from '/imports/ui/components/grid/row';
import Col from '/imports/ui/components/grid/col';
import Pager from '/imports/ui/components/pager';
import { Tabs, Tab } from '/imports/ui/components/tabs';

import MaveletPubBoardPage from './mavelet_pub_board_page';

const {
    // DEFAULT_LIMIT,
    DEFAULT_INFINITE_SCROLL_OFFSET,
} = Mavenx.globals;

/**
 * file: client.components.mavelet.MaveletPubBoard.jsx
 * by: MavenX - tewksbum Mar 2016
 * re: Publish the product to a number of boards
 */

class LoginState {
  static get() {
    if (Meteor.user()) {
      return LoginState.LOGGED_IN;
    } else if (Meteor.loggingIn()) {
      return LoginState.LOGGING_IN;
    } else if (!Accounts.loginServicesConfigured()) {
      return this.WAITING_CONFIG;
    } else {
      return this.LOGGED_OUT;
    }
  }
}

LoginState.LOGGED_IN = 'loggedIn';
LoginState.LOGGED_OUT = 'loggedOut';
LoginState.LOGGING_IN = 'loggingIn';
LoginState.WAITING_CONFIG = 'waitingConfig';


const MaveletPubBoard = React.createClass({
  mixins: [ReactMeteorData],

  getInitialState() {
    return {
      keyword: '',
      controller: 'my',
      selectedBoards: [],

      activeKeyword: '',

      pageCount: 1,
      endReached: true,
    };
  },

  componentWillMount() {
    this.setKeyword = _.debounce(this.setKeyword, 300);
  },

  shouldComponentUpdate(nextProps, nextState) {
    return shallowCompare(this, nextProps, nextState);
  },

  onKeyword(event) {
    if (event.target.value && event.target.value.length) {
      this.setKeyword(event.target.value);
    } else {
      this.setKeyword(null);
    }
  },

  setKeyword(value) {
    this.setState({ keyword: value });
  },

  getMeteorData() {
    return {
      loginState: LoginState.get(),
      verified: Meteor.user().isVerified(),
      loggedIn: LoginState.get() === LoginState.LOGGED_IN,
    };
  },

  scrollHeight() {
    const elem = ReactDOM.findDOMNode(this);
    return elem.scrollHeight;
  },

  scrollPos() {
    const elem = ReactDOM.findDOMNode(this);
    return elem.scrollTop;
  },

  handleScroll() {
    if ((this.scrollPos() + DEFAULT_INFINITE_SCROLL_OFFSET) >= this.scrollHeight()) {
      const { pageCount, endReached } = this.state;
      if (!endReached) {
        this.setState({ pageCount: (pageCount + 1), endReached: true });
      }
    }
  },

  canLoadMore() {
    this.setState({ endReached: false });
  },

  reset() {
    this.setState({ pageCount: 1 });
  },

  renderOpen() {
    if (this.data.loginState === LoginState.LOGGED_IN) {
      if (Meteor.user().isVerified()) {
        return (
          <button
            type="button"
            onClick={() => this.setState({ controller: 'open' })}
            data-keyword-filter="public"
            className={this.state.controller === 'open' && 'active'}
          ><span>Public</span>
          </button>
        );
      }
    }
  },

  renderFavorites() {
    if (this.data.loginState === LoginState.LOGGED_IN) {
      return (
        <button
          type="button"
          onClick={() => this.setState({ controller: 'myFavoriteBoards' })}
          data-keyword-filter="myFavoriteBoards"
          className={this.state.controller === 'myFavoriteBoards' && 'active'}
        ><span>Favorite</span>
        </button>
      );
    }
  },

  renderMyBoard() {
    return (
      <button
        type="button"
        onClick={() => this.setState({ controller: 'my' })}
        data-keyword-filter="my"
        className={this.state.controller === 'my' && 'active'}
      ><span>My Boards</span>
      </button>
    );
  },

  render() {
    const pageProps = _.extend(
        _.pick(this.props, 'deselectBoard', 'selectBoard', 'selectedBoards'),
        _.pick(this.state, 'controller', 'keyword')
    );
    const { pageCount, endReached, activeKeyword, controller, keyword } = this.state;
    const { loggedIn, verified } = this.data;
    const className = 'mavelet-wrapper';

    return (
      <section className="modal-body-inner clip-wiz" onScroll={this.handleScroll}>
        <div className="boardInformation">
          <Row className="header-row">
            <Col xs={12} sm={12} md={12} lg={12}>
              <h4 className="text-center">
                Select the boards on which to clip product(s), then press done.
              </h4>
            </Col>
          </Row>
          <Row>
            <Col xs={12} sm={12} md={12} lg={12}>
              <div className="form-group search-term-wrap">
                <input
                  id="search-term"
                  ref="searchterm"
                  type="text"
                  placeholder="Search"
                  className="form-control-custom form-control"
                  onChange={this.onKeyword}
                  defaultValue={activeKeyword}
                ></input>
                <i className="btn btn-default search-button fa fa-search"></i>
              </div>
            </Col>
          </Row>
          <Row>
            <Col xs={12} sm={12} md={12} lg={12}>
              <Tabs>
                {loggedIn && verified &&
                  <Tab
                    onClick={() => this.setState({ controller: 'open' })}
                    active={this.state.controller === 'open'}
                  >
                    <a>
                      <span>Public</span>
                    </a>
                  </Tab>
                }
                {loggedIn &&
                  <Tab
                    onClick={() => this.setState({ controller: 'myFavoriteBoards' })}
                    active={this.state.controller === 'myFavoriteBoards'}
                  >
                    <a>
                      <span>Favorite</span>
                    </a>
                  </Tab>
                }
                <Tab
                  active={this.state.controller === 'my'}
                  onClick={() => this.setState({ controller: 'my' })}
                >
                  <a><span>My Boards</span></a>
                </Tab>
              </Tabs>
            </Col>
          </Row>
          <Row>
            <Col xs={12} sm={12} md={12} lg={12}>
              <div className={className}>
                {_.times((pageCount), (i) => {
                  return (
                    <MaveletPubBoardPage
                      controller={controller}
                      keyword={keyword}
                      page={i}
                      key={i}
                      canLoadMore={((i + 1) === pageCount) ? this.canLoadMore : () => {}}
                      {...pageProps}
                    />
                  );
                })}
                {endReached ? '' : ''}
              </div>
            </Col>
          </Row>
        </div>
      </section>
    );
  },
});

// scrollElement={ReactDOM.findDOMNode(this)}

export default MaveletPubBoard;
