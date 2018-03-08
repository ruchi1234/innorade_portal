import React from 'react';
import shallowCompare from 'react-addons-shallow-compare';

import Masonry from 'meteor/mavenx:react-masonry-component';
import PageHOC from '/imports/ui/components/masonry/page_hoc';
import Pager from '/imports/ui/components/pager';

const PagedMasonryHOC = (options) => {
  const {
    tileProps,
    pageSubscribe,
    pageDocuments,

    Tile,
    EmptyMessage,
    className,
  } = options;

  const Page = PageHOC({
    Tile,
    EmptyMessage,

    subscribe: pageSubscribe,
    documents: pageDocuments,
  });

  return React.createClass({
    propTypes: {
      controller: React.PropTypes.string,
      filter: React.PropTypes.string,
    },

    shouldComponentUpdate(nextProps, nextState) {
      return shallowCompare(this, nextProps, nextState);
    },

    componentDidUpdate() {
      this.resetMasonry();
    },

    resetMasonry() {
      if (this.refs.masonry) {
        this.refs.masonry.performLayout();
      }
    },

    reset() {
      if (this.refs.masonry) {
        this.refs.masonry.performLayout();
      }
      if (this.refs.pager) {
        this.refs.pager.reset();
      }
    },

    render() {
      // const { reactive, boardId, controller, keyword, filter } = this.props;
      const { controller, filter } = this.props;

      const queryHelpers = [];
      if (controller) { queryHelpers.push(controller); }
      if (filter) { queryHelpers.push(filter); }

      const tProps = { tileProps: ((tileProps || (() => {}))(this.props) || {}) };
      const allPageProps = Object.assign({}, this.props, {
        didUpdate: this.resetMasonry,
      }, tProps);

      return (
        <div className="container-masonry" style={{ marginLeft: '-7.5px', marginRight: '-7.5px' }}>
          <Masonry
            className={`masonry ${className || ''}`}
            ref="masonry"
            options={{
              itemSelector: '.brick',
              gutter: 0,
              percentPosition: false,
            }}
          >
            <Pager
              ref="pager"
              pageComponent={Page}
              pageProps={allPageProps}
              didUpdate={() => this.resetMasonry()}
            />
          </Masonry>
        </div>
      );
    },
  });
};

export default PagedMasonryHOC;
