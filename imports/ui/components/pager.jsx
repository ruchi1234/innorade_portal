import React from 'react';
import ReactDOM from 'react-dom';
import shallowCompare from 'react-addons-shallow-compare';

/*
** file: client.component.pager
** by: MavenX - tewksbum jun 2016
** re:
** reference:
*/

const {
  DEFAULT_INFINITE_SCROLL_OFFSET,
} = Mavenx.globals;

/*
 * Scrolls tells the compont if it's intended to handle scrolling.
 * If so, you must style appropriatly
 */
const Pager = React.createClass({
  propTypes: {
    scrolls: React.PropTypes.bool,
    pageProps: React.PropTypes.object,
    pageComponent: React.PropTypes.func.isRequired,
    renderNoMoreHTML: React.PropTypes.bool,
    didUpdate: React.PropTypes.func,
    className: React.PropTypes.string,
  },

  getDefaultProps() {
    return {
      className: '',
      didUpdate() {},
    };
  },

  getInitialState() {
    return {
      pageCount: 1,
      endReached: true,
    };
  },

  componentWillMount() {
    if (!this.props.scrolls) {
      window.addEventListener('scroll', this.handleScroll);
    }
  },

  shouldComponentUpdate(nextProps, nextState) {
    return shallowCompare(this, nextProps, nextState);
  },

  componentDidUpdate() {
    this.props.didUpdate();
  },

  componentWillUnmount() {
    if (!this.props.scrolls) {
      window.removeEventListener('scroll', this.handleScroll);
    }
  },

  scrollHeight() {
    const { scrolls } = this.props;
    if (scrolls) {
      const elem = ReactDOM.findDOMNode(this);
      let height = 0;
      $(elem).children().each(() => {
        height += $(this).outerHeight();
      });
      return height;
    } else {
      return document.body.offsetHeight;
    }
  },

  scrollPos() {
    const { scrolls } = this.props;
    if (scrolls) {
      const elem = ReactDOM.findDOMNode(this);
      return elem.scrollTop;
    }

    return window.innerHeight + (window.scrollY || window.pageYOffset);
  },

  handleScroll() {
    /*
     * TODO
     * After conversion to 1.3 I think this should be reworked to use something like
     * ttps://brigade.github.io/react-waypoint/
     */

    /*
     * Extra padding is to account for height of last row, and provide some
     * extra padding so it's less likely the user will need to wait on
     * loading data
     */

    /*
     * If we are close to the bottom and not waiting on data to load
     * then load more
     */
    if ((this.scrollPos() + DEFAULT_INFINITE_SCROLL_OFFSET) >= this.scrollHeight()) {
      const { pageCount, endReached } = this.state;
      if (!endReached) {
        this.setState({ pageCount: (pageCount + 1), endReached: true });
      }
    }
  },

  /*
   * Helpers for children
   */
  canLoadMore() {
    this.setState({ endReached: false });
  },

  /*
   * Helpers for the outside world
   */
  reset() {
    this.setState({ pageCount: 1 });
  },

  render() {
    const { pageProps, pageComponent: PageComponent, renderNoMoreHTML, className } = this.props;
    const { pageCount, endReached } = this.state;

    return (
      <div className={className} onScroll={this.handleScroll}>
        {_.times((pageCount), (i) => {
          return (
            <PageComponent
              page={i}
              key={i}
              canLoadMore={((i + 1) === pageCount) ? this.canLoadMore : () => {}}
              {...pageProps}
            />
          );
        })}
        {endReached ? renderNoMoreHTML : ''}
      </div>
    );
  },
});

export default Pager;
