import { Meteor } from 'meteor/meteor';
import React from 'react';

import { FlowRouter } from 'meteor/kadira:flow-router';
import FlowHelpers from '/imports/startup/flow_helpers';
import Img from '/imports/ui/components/img';
import Counts from '/imports/ui/components/counts';

/*
** file: client.components.hero_card.QuoteCard
** by: MavenX - tewksbum May 2016
** re: simple card for showing
*/

const QuoteCard = React.createClass({
  propTypes: {
    card: React.PropTypes.object.isRequired,
    bproductId: React.PropTypes.string,
    creatorName: React.PropTypes.string.isRequired,
    creatorImage: React.PropTypes.string.isRequired,
  },

  onClickCard() {
    FlowRouter.go(FlowHelpers.pathFor('board', { _id: this.props.card.boardId }));
  },

  render() {
    const { creatorImage, creatorName } = this.props;
    const { favoriteCount, caption, boardTitle, boardId, _id } = this.props.card;

    return (
      <div className="card cursor">
        <div onClick={() => FlowRouter.go('product', { _id })} className="cursor">
          <figure className="images">
            <figcaption className="caption">
              {this.props.bproductId}
              <p className="clamp clamp-8">
                {caption}
              </p>
              <Counts favorites={favoriteCount || 0} />
            </figcaption>
          </figure>
          <div className="user-info-block">
            <Img src={creatorImage} circle />
            <ul>
              <li className="username clamp clamp-1">
                {creatorName}
              </li>
            </ul>
          </div>
        </div>
        <div className="card-footer cursor board-title" onClick={this.onClickCard}>
          <p className="clamp clamp-2">
            {boardTitle}
          </p>
        </div>
      </div>
    );
  },
});

export default QuoteCard;
