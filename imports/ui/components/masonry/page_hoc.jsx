import React from 'react';
import Brick from '/imports/ui/components/masonry/brick';
import { composeWithTracker } from 'react-komposer';
import PageMessage from '/imports/ui/components/page_message';
import Loader from '/imports/ui/components/loader';

import { MeteorListData } from '/imports/ui/helpers';

const PageHOC = (options) => {
  const {
    Tile,
    EmptyMessage,

    subscribe,
    documents,
  } = options;

  const Page = React.createClass({
    propTypes: {
      didUpdate: React.PropTypes.func,
      docs: React.PropTypes.array.isRequired,
      ready: React.PropTypes.bool.isRequired,
      page: React.PropTypes.number.isRequired,
      tileProps: React.PropTypes.object,
    },

    shouldComponentUpdate(nextProps, nextState) {
      return !_.isEqual(nextProps.queryHelpers, this.props.queryHelpers) ||
        !_.isEqual(nextProps.docs, this.props.docs) ||
        nextProps.ready !== this.props.ready ||
        nextProps.keyword !== this.props.keyword;
    },

    componentDidUpdate() {
      this.props.didUpdate();
    },

    render() {
      const { docs, ready, tileProps } = this.props;
      if (!ready) {
        return <PageMessage><Loader /></PageMessage>;
      }

      // If no docs and first page
      // Tell them something
      if (!docs || !docs.length) {
        return (this.props.page === 0 && EmptyMessage) ?
          <EmptyMessage /> :
          <span></span>;
      }

      return (
        <span>
        {
          docs.map((doc) => (
            <Brick key={doc._id}><Tile doc={doc} {...tileProps} /></Brick>
          ))
        }
        </span>
      );
    },
  });

  return composeWithTracker(MeteorListData({ subscribe, documents }))(Page);
};

export default PageHOC;
