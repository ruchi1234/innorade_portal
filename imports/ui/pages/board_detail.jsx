/* global utu */
import React from 'react';
import { _ } from 'meteor/underscore';
import { Meteor } from 'meteor/meteor';
import mixpanel from 'mixpanel-browser';
import { FlowRouter } from 'meteor/kadira:flow-router';

import { composeWithTracker, composeAll } from 'react-komposer';
import data from '/imports/data/boards/byId';
import loginState from '/imports/data/users/login_state';
import Boards from '/imports/modules/boards/collection';

import DetailHeader from '/imports/ui/components/detail/detail_header';
import showAddEditBoardModal from '/imports/ui/components/boards/add_edit_modal';
import Container from '/imports/ui/components/grid/container';
import BProductsList from '/imports/ui/pages/bproducts_list';
import Loader from '/imports/ui/components/loader';
import ImageModal from '/imports/ui/components/image/image_modal';
import BoardProductsSortableModal from '/imports/ui/components/boards/sort/sortable_modal';

import updateDochead from '/imports/modules/update_dochead';
import can from '/imports/modules/can/can';
import EditPopover from '/imports/ui/components/detail/edit_popover';

import FavoriteIcon from '../boards/favoriteIcon';
import ShareIcon from '../boards/shareIcon';
import ClipIcon from '../boards/clipIcon';
import FlagIcon from '../lib/icons/flag.jsx';

const setDochead = (_id, board) => {
  const { title } = (board || {});
  const opts = _.pick((board || {}), 'caption', 'title', 'createdAt', 'description');

  if (board) {
    opts.title = title;
    opts.image = board.getImage();
    opts.description = board.caption || board.description;

    // add a product image if no board image
    if (!opts.image) {
      opts.image = board.getBoardProductImage();
    }
    opts.creatorName = board.creator && board.creator.fullName;
    opts.keywords = `${title || ''} Maven mavenx.com`;
  }
  opts.url = FlowRouter.url('board', { _id });
  opts.type = 'article';

  updateDochead(opts);
};

/*
** file: client.BoardHeader_Container.jsx
** by: MavenX - tewksbum Mar 2016
**              JimmieB May 2016
** re: Basic layout for top nav and grid body
*/

// TODO: re-enable pre-render cards

// TODO: when displaying a board, if its a private board, it should only
// be visible by an access control list.
const BoardDetail = React.createClass({
  propTypes: {
    board: React.PropTypes.object,
    boardId: React.PropTypes.string.isRequired,
    ready: React.PropTypes.bool,
  },

  getInitialState() {
    return {
      showImageGallery: false,
    };
  },

  componentDidMount() {
    setDochead(this.props.boardId, this.props.board);
  },

  componentDidUpdate() {
    setDochead(this.props.boardId, this.props.board);
  },

  onSortImages() {
    this.refs.sortImagesModal.show();
  },

  onUpdateImages(images) {
    const { board } = this.props;
    this.updateBoard(images);
    mixpanel.track('Board - Added Images', {
      boardId: board._id,
    });
    utu.track('Board - Added Images', {
      boardId: board._id,
    });
  },

  onEditBoard() {
    this.refs.boardmodal.show();
  },

  onShowImageGallery() {
    this.refs.sortImagesModal.show();
  },

  onSortBoardProducts() {
    this.refs.boardProductSortModal.show();
  },

  removeBoard() {
    Meteor.call('board.remove', this.props.board._id, (err) => {
      if (!err) {
        mixpanel.track('Deleted Board', {
          boardId: this.props.board._id,
        });
        utu.track('Deleted Board', {
          boardId: this.props.board._id,
        });
        window.history.back();
        // FlowRouter.go('myboards');
      }
    });
  },

  handleAddImage(image) {
    const { board } = this.props;
    Boards.api.addImage.call({
      _id: board._id,
      image,
    });
  },

  updateBoard(params) {
    const { board } = this.props;
    const status = params.status ? 1 : 0;
    const type = params.type ? 1 : 0;
    const args = {
      status,
      type,
      caption: params.caption,
      title: params.title,
    };
    Meteor.call('board.update', board._id, args, () => {
      this.refs.boardmodal.hide();
      // $(this.refs.boardmodal).modal('hide');
      // this.refs.boardmodal.hide();
      // $('#boardmodal').modal('toggle');
      // $('#wizBoardModal').modal('toggle');
      // console.log("r", r);
      // console.log("e", e);
    });
  },

  changeBoardProductsOrder() {
    this.refs.boardProductsOrderModal.show();
    this.setState({ reactive: true });
  },

  boardProductsOrderModalClose() {
    mixpanel.track('Board - Ordered Products', {
      boardId: this.props.boardId,
    });
    utu.track('Board - Ordered Products', {
      boardId: this.props.boardId,
    });
    this.setState({ reactive: false });
  },

  render() {
    const { board, boardId, ready, userId } = this.props;
    // Document wasn't found bounce them to boards browse page
    if (ready && !board) {
      Bert.alert('The page you requested is not available.  You are being redirected to product' +
      ' directory.', 'warning', 'fixed-top');
      FlowRouter.go('boards');
    }

    if (!ready || !board) {
      return (
        <section>
          <Loader />
        </section>
      );
    } else {
      const detail = {
        _id: board._id,
        caption: board.caption,
        clips: board.boardProductCount,
        faves: board.favoritedByIds && board.favoritedByIds.length || 0,
        hero: board.getImage(),
        images: board.images || [],
        status: board.status,
        title: board.title,
        type: board.type,
      };

      const creator = board.getCreator();

      const editBtn = can.update.board(userId, boardId) ? (
        <EditPopover
          card={detail}
          popover={
            <ul className="nav nav-pills nav-stacked share-popover">
              <li>
                <a onClick={() => showAddEditBoardModal({ boardId })}>
                  Edit board information
                </a>
              </li>
              <li>
                <a onClick={this.onShowImageGallery}>
                  Arrange board images
                </a>
              </li>
              <li>
                <a onClick={this.onSortBoardProducts}>
                  Arrange products
                </a>
              </li>
            </ul>
          }
        />
      ) : undefined;


      return (
        <article className="browse">
          <DetailHeader
            detail={detail}
            typeLabel="board"
            toolbarBtns={[
              <FavoriteIcon boardId={boardId} />,
              <ShareIcon boardId={boardId} preferPlace="below" />,
              editBtn,
              can.clipToBoard(userId, boardId) && <ClipIcon boardId={boardId} />,
              <FlagIcon />,
            ]}

            creatorName={creator.username || ''}
            creatorImage={creator.getImage()}
            creatorId={creator.userId || ''}
            creatorFavoritedCount={creator && creator.favoritedCount}
            creator={creator}
          />
          <div className="related">
            <Container>
              <BProductsList boardId={board._id} reactive />
            </Container>
          </div>
          <ImageModal
            _id={board._id}
            doc={board}
            images={board.images || []}
            handleAddImage={this.handleAddImage}
            onUpdateImages={this.onUpdateImages}
            ref="sortImagesModal"
          />
          <BoardProductsSortableModal
            boardId={board._id}
            ref="boardProductSortModal"
          />
        </article>
      );
    }
  },
});

const BoardDetailWData = composeAll(
  composeWithTracker(data),
  composeWithTracker(loginState)
)(BoardDetail);
export default BoardDetailWData;
export { BoardDetail };
