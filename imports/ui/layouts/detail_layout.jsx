import React from 'react';
import Layout from '/imports/ui/layouts/layout';

/*
** file: imports/ui/layouts/detail_layout.jsx
** by: MavenX - sboyd Apr 2016
**              tewksbum May 2016
**              tewksbum Jun 2016
** re: The top-level layout of a detail view.
*/

const DetailLayout = React.createClass({
  propTypes: {
    detail: React.PropTypes.object.isRequired,
    myType: React.PropTypes.string,
  },

  render() {
    const myType = this.props.myType;
    return (
      <Layout showSearch={false} showMy={false} myType={myType}>
        {this.props.detail}
      </Layout>
    );
  },
});

export default DetailLayout;
