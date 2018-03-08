import React from 'react';
import { Meteor } from 'meteor/meteor';
import { FlowRouter } from 'meteor/kadira:flow-router';
import { _ } from 'meteor/underscore';

import CanHOF from '/imports/modules/can/can_hof';
import { composeWithTracker } from 'react-komposer';
import routeData from '/imports/data/misc/route';
import { Tabs, Tab } from '/imports/ui/components/tabs';
import { showLogin } from '/imports/ui/components/login/modal';

const DEFAULT_FILTER = 'All';

const SearchBar = React.createClass({
  propTypes: {
    loggedIn: React.PropTypes.bool.isRequired,

    filters: React.PropTypes.arrayOf(React.PropTypes.string),

    activeFilter: React.PropTypes.string,
    activeKeyword: React.PropTypes.string,
    activeCategory: React.PropTypes.string,

    routeName: React.PropTypes.string.isRequired,
    defaultFilter: React.PropTypes.string,
  },

  getDefaultProps() {
    return {
      activeFilter: DEFAULT_FILTER,
      activeKeyword: '',
      filters: [],
    };
  },

  componentWillMount() {
    this.setKeyword = _.debounce(this.setKeyword, 300);
  },

  componentDidMount() {
    this.validateFilter();
  },

  componentDidUpdate(prevProps) {
    this.validateFilter();

    if (prevProps.routeName !== this.props.routeName) {
      this.resetValue();
    }
  },

  onFilter(filter) {
    const action = () => {
      FlowRouter.setQueryParams({ filter });
    };

    if (filter !== 'Favorite') {
      action();
    } else {
      this.shareByEmail = CanHOF({
        action: 'favorite',
        type: 'board',
        handleLogin: () => {
          showLogin({ message: 'To view your favorites, please login.' });
        },
        handleAction: action,
      })();
    }
  },

  onKeyword(event) {
    if (event.target.value && event.target.value.length) {
      this.setKeyword(event.target.value);
    } else {
      this.setKeyword(null);
    }
  },

  onKeywordImmediate(e) {
    // If key is enter
    // set keyword immediatly
    if (e.keyCode === 13) {
      if (e.target.value && e.target.value.length) {
        this.setKeyword(e.target.value);
      } else {
        this.setKeyword(null);
      }
    }
  },

  setKeyword(val) {
    FlowRouter.setQueryParams({ keyword: val });
  },

  canFilterFavorite() {
    const { loggedIn } = this.props;
    return loggedIn;
  },

  resetValue() {
    this.refs.searchInput.value = this.props.activeKeyword;
  },

  validateFilter() {
    const { filters } = this.props;
    // Reset filter to all
    if (!_.contains(filters, FlowRouter.getQueryParam('filter'))) {
      FlowRouter.setQueryParams({
        filter: this.props.defaultFilter,
      });
    }
  },

  render() {
    const { filters, activeFilter, activeKeyword, activeCategory } = this.props;
    const showFilters = filters && (filters.length > 0);

    return (<div>
      <div className="navbar navbar-form" id="global-search">
        <div className="container">
          <div className="input-group input-group-lg">
            {
              /* We use defaultValue to allow debounce without making their
                 input sluggish, or dropping kepresses
              */
            }
            <input
              ref="searchInput"
              type="search"
              placeholder="Search"
              className="form-control pull-left"
              onChange={this.onKeyword}
              onKeyUp={this.onKeywordImmediate}

              defaultValue={activeKeyword}
            />
            <div className="input-group-btn">
              <button type="submit" className="btn btn-default search-button fa fa-search">
                <span className="sr-only">Search</span>
              </button>
            </div>
          </div>
        </div>
      </div>


      {showFilters &&
        <Tabs subtitle={activeCategory}>
          {filters.map((filter) => {
            const onClick = (e) => {
              e.preventDefault();
              this.onFilter(filter);
            };
            return (<Tab active={filter === activeFilter} key={filter}>
              <a href="#" onClick={onClick}>
                <span>{filter}</span>
              </a>
            </Tab>);
          })}
        </Tabs>
      }
    </div>);
  },
});

const SearchBarWData = composeWithTracker(routeData)(
  MeteorData(SearchBar, {
    getData() {
      return {
        loggedIn: !!Meteor.userId(),
        activeFilter: FlowRouter.getQueryParam('filter'),
        activeKeyword: FlowRouter.getQueryParam('keyword'),
        activeCategory: FlowRouter.getQueryParam('category'),
      };
    },
  })
);

export default SearchBarWData;

const keywordState = (props, onData) => {
  onData(null, {
    keyword: FlowRouter.getQueryParam('keyword'),
  });
};

const filterState = (props, onData) => {
  onData(null, {
    filter: FlowRouter.getQueryParam('filter'),
  });
};

export { SearchBar, filterState, keywordState };
