import React from 'react';
import SlugsList from '/imports/ui/pages/slugs_list';

const SlugBoards = React.createClass({
  propTypes: {
    controller: React.PropTypes.string.isRequired,
    slug: React.PropTypes.string,
    reactive: React.PropTypes.bool,
  },

  render() {
    const { slug, reactive, controller } = this.props;
    return (
      <SlugsList slug={slug} controller={controller} reactive={reactive} />
    );
  },
});

export default SlugBoards;
