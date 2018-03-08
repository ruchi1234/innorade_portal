import React from 'react';
import { Meteor } from 'meteor/meteor';
import { composeWithTracker, composeAll } from 'react-komposer';
import { FlowRouter } from 'meteor/kadira:flow-router';
import data from '/imports/data/boards/byId';
import Share from '/imports/ui/components/share/share';
import ShareByEmailModal from '/imports/ui/components/boards/share_by_email_modal';
import can from '/imports/modules/can/can';
import loginState from '/imports/data/users/login_state';
import canHOF from '/imports/modules/can/can_hof';

class ShareBtn extends React.Component {
  render() {
    const { userId, boardId, board, preferPlace } = this.props;
    if (!board) { return <span>Test</span>; }
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
      <li className={`share ${!show ? 'hidden' : ''}`} key="shareBtn">
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
        />
        <ShareByEmailModal
          boardId={board._id}
          ref="shareByEmailModal"
        />
      </li>
    );
  }
}

ShareBtn.propTypes = {
  userId: React.PropTypes.string,
  boardId: React.PropTypes.string.isRequired,
  board: React.PropTypes.object.isRequired,
};

export default composeAll(
  composeWithTracker(data),
  composeWithTracker(loginState)
)(ShareBtn);
