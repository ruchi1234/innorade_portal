import React from 'react';

import { FlowRouter } from 'meteor/kadira:flow-router';
import FlowHelpers from '/imports/startup/flow_helpers';

import Row from '/imports/ui/components/grid/row';
import Col from '/imports/ui/components/grid/col';

/*
** file: client.modules.products.clip.clip_card.jsx
** by: MavenX - tewksbum May 2016
** re: Render list of product clips
*/

const formatCurrency = (num) => `$${parseFloat(String(num)).toFixed(2).replace(/(\d)(?=(\d\d\d)+(?!\d))/g, '$1,')}`;

const ClipCard = React.createClass({

  propTypes: {
    boardProduct: React.PropTypes.object.isRequired,
  },

  onClickCard() {
    FlowRouter.go(FlowHelpers.pathFor('product', { _id: this.props.boardProduct._id }));
  },

  render() {
    const { caption, images, price, title, favoritedByIds } = this.props.boardProduct;

    const hero = images && images[0] && images[0].href || '';
    const favoriteCount = favoritedByIds && favoritedByIds.length || 0;
    return (
      <li
        className="listCard"
        onClick={this.onClickCard}
      >
          <Row>
            <Col>
              <label
                className="clamp clamp-2 product-title"
              >
                {
                  title
                }
              </label>
              <p className="clamp clamp-4">
                {
                  caption
                }
              </p>
            </Col>
            <Col>
              <div className="top">
                <img className="img-responsive" src={hero} alt={caption} />
              </div>
              <div className="bottom">
                <span
                  aria-hidden="true"
                  className="glyphicon glyphicon-heart"
                >
                  {
                    favoriteCount
                  }
                </span>
                <span>
                  {
                    formatCurrency(price)
                  }
                </span>
              </div>
            </Col>
          </Row>
      </li>
    );
  },
});

export default ClipCard;
