import React from 'react';
import Layout from '/imports/ui/layouts/layout';

/*
** file: imports/ui/layouts/list_layout.jsx
** by: MavenX - tewksbum Apr 2016
**              jimmieb May 2016
**              tewksbum Jun 2016
** re:
*/

const ListLayout = ({ children, filters, bar }) => (
  <Layout filters={filters} bar={bar}>
    <article className="browse">
      <section className="tab-content">
        <div id="all_boards" role="tabpanel" className="tab-pane active">
          <div className="container">
            {children}
          </div>
        </div>
      </section>
    </article>
  </Layout>
);

ListLayout.propTypes = {
  children: React.PropTypes.node.isRequired,
  filters: React.PropTypes.array,
  bar: React.PropTypes.node,
};

export default ListLayout;
