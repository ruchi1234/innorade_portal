import React from 'react';

import BoardsList from '/imports/ui/pages/boards_list';
import SlugBoards from '/imports/ui/pages/slug_boards';
import canHOC from '/imports/ui/can_hoc';

/*
** file: client.BoardHeader_Container.jsx
** by: MavenX - tewksbum Mar 2016
**              tewksbum May 2016
** re: Basic layout for top nav and grid body
*/
const MyBoards = React.createClass({
  render() {
    return (
      <article className="browse">
        <SlugBoards controller="my" reactive/>
      </article>
    );
  },
});

export default MyBoards;
