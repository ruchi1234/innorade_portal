import React from 'react';
import shallowCompare from 'react-addons-shallow-compare';
import { Meteor } from 'meteor/meteor';

import Counts from '/imports/ui/components/counts';
import Row from '/imports/ui/components/grid/row';
import Img from '/imports/ui/components/img';

/**
 * file: client.components.hero_card.HeroCard
 * by: MavenX - tewksbum Mar 2016
 * re: structure for masonry view w/ one a main image followed by 3 minor
 * images and a caption.
 */

const ListCard = React.createClass({
  propTypes: {
    board: React.PropTypes.object.isRequired,
    toggleChecked: React.PropTypes.func,
    showCheckbox: React.PropTypes.bool,
    checked: React.PropTypes.bool,
    className: React.PropTypes.string,
    onClick: React.PropTypes.func,
  },

  getDefaultProps() {
    return { className: '' };
  },

  shouldComponentUpdate(nextProps, nextState) {
    return shallowCompare(this, nextProps, nextState);
  },

  closeWR() {
    window.open(`${Meteor.absoluteUrl()}board/${this.props.board._id}`, '_blank');
    window.close();
  },

  render() {
    const { board, toggleChecked, showCheckbox, checked, className, onClick } = this.props;

    // not much to do if board isn't populated?
    // This component should be moved to cards/boards since it's board
    // specific
    if (!board) { return <span></span>; }

    const { images } = board;
    const boardProductImages = board.boardProductImages || [];
    const firstBoardImage = _.get(images, '0.href');
    let thumbnails = [];
    let boardImage = board.getImage();
    if (!boardImage) {
      if (boardProductImages.length > 0) {
        boardImage = _.get(boardProductImages, '0.href');
        thumbnails = boardProductImages
          .map((image) => image && image.href)
          .filter((image) => image)
          .slice(1, 5);
      }
    } else {
      if (boardProductImages.length > 0) {
        thumbnails = boardProductImages.map((image) => (
          image && image.href
        )).filter((image) => image).slice(0, 4);
      }
    }

    const creator = board.getCreator();
    return (
      <div
        className={`listcard ${className}`}
        onClick={showCheckbox && toggleChecked || onClick || this.closeWR}
        ref="this"
      >
        <Row>
          {showCheckbox && (
            <div
              className="listCardCheckbox"
            >
              <input
                type="checkbox"
                aria-label="..."
                checked={checked}
                onChange={toggleChecked}
              />
            </div>
          )}
          <div className="listcardImagesContainer">
            <div className="listcardImages">
              <Img src={boardImage} className="hero" />
              <div className="thumbnails">
                {
                  thumbnails.map((url, key) => (
                    url && <Img src={url} alt="clip-thumbnail" key={key} cover />
                  ))
                }
              </div>
            </div>
          </div>
          <div className="content">
            <div className="top-content">
              <p className="listCardTitle clamp clamp-2">
                {board.title}
              </p>

              <Img src={creator.getImage()} alt={creator.username} circle x2 />
            </div>
            <div className="bottom-content">
              <Counts
                favorites={board.boardProductsFavoritesCount}
                clips={board.boardProductCount}
              />

              <p className="username clamp clamp1">
                {creator.username}
              </p>
            </div>
          </div>
        </Row>
      </div>
    );
  },
});

export default ListCard;
