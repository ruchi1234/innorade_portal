import React from 'react';
import { Meteor } from 'meteor/meteor';
import { composeWithTracker, composeAll } from 'react-komposer';
import { FlowRouter } from 'meteor/kadira:flow-router';
import data from '/imports/data/clips/byId';
import Share from '/imports/ui/components/share/share';
import ShareByEmailModal from '/imports/ui/components/products/modal/share_by_email';
import can from '/imports/modules/can/can';
import loginState from '/imports/data/users/login_state';
import canHOF from '/imports/modules/can/can_hof';

class ShareBtn extends React.Component {
  render() {
    const { userId, clipId, clip, preferPlace } = this.props;
    if (!clip) { return <span></span>; }

    console.log("ShareBtn");
    console.log(this.props);

    const affiliateUrl = FlowRouter.url(
      'mixpanelTrack',
      {},
      { url: encodeURIComponent(clip.aurl), productId: clip._id }
    );
    const affiliatePinUrl = FlowRouter.url(
      'mixpanelTrack',
      {},
      { url: encodeURIComponent(clip.aurl),
        clipId: clip._id,
        retailer: clip.retailer,
        mixpanelLabel: encodeURIComponent('AURL - Pinterest Redirect'),
        boardId: clip.boardId,
      }
    );
    const affiliateLinkUrl = FlowRouter.url(
      'mixpanelTrack',
      {},
      { url: encodeURIComponent(clip.aurl),
        clipId: clip._id,
        retailer: clip.retailer,
        mixpanelLabel: encodeURIComponent('AURL - Link Redirect'),
        boardId: clip.boardId,
      }
    );
    const show = can.share.clip(userId, clipId) || can.invite.clip(userId, clipId);
    const showEmbed = can.share.clipEmbed(userId, clipId);
    const embedUrl = Meteor.absoluteUrl(`embed/clip/${clipId}`);
    const embed = `<iframe src="${embedUrl}" height="455" width="288" frameborder="0"></iframe>`;
    const handleShareByEmail = canHOF({
      action: 'share',
      type: 'byEmail',
      authDenyMsg: 'To send a product clipping using email, please login or create an account.',
      handleAction: () => this.refs.shareByEmailModal.show(),
    });
    return (
      <li className={`share ${!show ? 'hidden' : ''}`}>
        <Share
          inviteOnly={!!(clip || {}).type}
          showEmbed={showEmbed}
          embed={embed}
          type="clip"
          clip={clip}
          handleShareByEmail={handleShareByEmail}
          url={FlowRouter.url('product', { _id: clip._id })}
          title={clip.title}
          caption={clip.caption}
          imageUrl={clip.getImage()}
          affiliateUrl={affiliateUrl}
          affiliatePinUrl={affiliatePinUrl}
          affiliateLinkUrl={affiliateLinkUrl}
          preferPlace={preferPlace}
        />
        <ShareByEmailModal
          productId={clipId}
          ref="shareByEmailModal"
        />
      </li>
    );
  }
}

ShareBtn.propTypes = {
  userId: React.PropTypes.string,
  clipId: React.PropTypes.string.isRequired,
  clip: React.PropTypes.object.isRequired,
};

export default composeAll(
  composeWithTracker(data),
  composeWithTracker(loginState)
)(ShareBtn);
