import React from 'react';
import { FlowRouter } from 'meteor/kadira:flow-router';
import { Meteor } from 'meteor/meteor';

import BoardsPagedMasonry from '/imports/ui/components/users/paged_masonry';
import updateDochead from '/imports/modules/update_dochead';

const setDochead = () => {
  const opts = {};
  opts.description = 'At Maven Xchange - shop, share, ' +
    'and earn money by recommending products you know others will love!';
  opts.image = Meteor.absoluteUrl('/img/default_ssr_image.jpg');

  updateDochead(opts);
};

const SlugsList = React.createClass({
  propTypes: {
    slug: React.PropTypes.string,
    filter: React.PropTypes.string,
    controller: React.PropTypes.string,
    reactive: React.PropTypes.bool,
  },

  componentDidMount() {
    setDochead();
  },

  componentDidReceiveProps() {
    this.refs.masonry.reset();
  },

  render() {
    const { keyword, filter, slug, controller, reactive } = this.props;

    const queryHelpers = [];

    if (controller !== 'my') {
      if (filter) { queryHelpers.push(filter); }
    }
    if (controller) { queryHelpers.push(controller); }
    if (slug) { queryHelpers.push('slug'); }

    return (
      <BoardsPagedMasonry
        ref="masonry"
        queryHelpers={queryHelpers}
        slug={slug}
        keyword={keyword}
        reactive={reactive}
      />
    );
  },
});

const SlugsListWData = MeteorData(SlugsList, {
  getData(props) {
    const filter = FlowRouter.getQueryParam('filter');
    return {
      keyword: FlowRouter.getQueryParam('keyword'),
      filter: (filter && filter.toLowerCase()),
    };
  },
});

export default SlugsListWData;
