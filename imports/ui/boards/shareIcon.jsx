import React, { PropTypes } from 'react';
import { Meteor } from 'meteor/meteor';
import { composeWithTracker, composeAll } from 'react-komposer';
import { FlowRouter } from 'meteor/kadira:flow-router';
import data from '../../data/boards/byId';
import Share from '../lib/share';
import ShareByEmailModal from '../components/boards/share_by_email_modal';
import can from '../../modules/can/can';
import loginState from '../../data/users/login_state';
import canHOF from '../../modules/can/can_hof';

class ShareBtn extends React.Component {
  render() {
    const { userId, boardId, board, preferPlace } = this.props;
    if (!board) { return <span></span>; }

    const show = can.share.board(userId, boardId) || can.invite.board(userId, boardId);
    const showEmbed = can.share.boardEmbed(userId, boardId);
    const embedUrl = Meteor.absoluteUrl(`embed/board/${boardId}`);
    const embed = `<iframe src="${embedUrl}" height="455" width="288" frameborder="0"></iframe>`;

    const handleShareByEmail = canHOF({
      action: 'share',
      type: 'byEmail',
      authDenyMsg: 'To send a board using email, please login or create an account.',
      handleAction: () => this.refs.shareByEmailModal.show(),
    });
    return (
      show ?
        <Share
          preferPlace={preferPlace}
          inviteOnly={!!(board || {}).type}
          showEmbed={showEmbed}
          embed={embed}
          type="board"
          url={FlowRouter.url('board', { _id: boardId })}
          title={board.title}
          imageUrl={board.getImage() || board.getBoardProductImage()}
          handleShareByEmail={handleShareByEmail}
        >
          <ShareByEmailModal
            boardId={board._id}
            ref="shareByEmailModal"
          />
        </Share>
      : <span />
    );
  }
}

ShareBtn.propTypes = {
  userId: PropTypes.string,
  boardId: PropTypes.string.isRequired,
  board: PropTypes.object.isRequired,
  preferPlace: PropTypes.string,
};

export default composeAll(
  composeWithTracker(data),
  composeWithTracker(loginState)
)(ShareBtn);
