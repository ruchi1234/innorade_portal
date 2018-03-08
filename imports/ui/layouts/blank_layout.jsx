import React from 'react';

/*
** file: import.ui.layouts.BlankHtml
** by: MavenX - tewksbum Feb 2016
**              tewksbum Jun 2016
** re: This is used by some of the default routes
** reference:
*/

const BlankLayout = React.createClass({
  propTypes: {
    content: React.PropTypes.node.isRequired,
  },

  render() {
    return (
      <div className="container-fluid">
        {this.props.content}
      </div>
    );
  },
});

export default BlankLayout;
