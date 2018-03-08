import React, { PropTypes } from 'react';
import { Meteor } from 'meteor/meteor';
import { composeWithTracker, composeAll } from 'react-komposer';
import { FlowRouter } from 'meteor/kadira:flow-router';
import data from '../../data/users/byId';
import Share from '../lib/share';
import ShareByEmailModal from '../components/users/share_by_email_modal';
import can from '../../modules/can/can';
import loginState from '../../data/users/login_state';
import canHOF from '../../modules/can/can_hof';

class ShareBtn extends React.Component {
  render() {
    const { userId, suser, slug, preferPlace } = this.props;
    if (!suser) { return <span></span>; }
    const showEmbed = can.share.profileEmbed(slug);
    const embedUrl = Meteor.absoluteUrl(`embed/profile/${slug}`);
    const embed = `<iframe src="${embedUrl}" height="455" width="288" frameborder="0"></iframe>`;
    const handleShareByEmail = canHOF({
      action: 'share',
      type: 'byEmail',
      authDenyMsg: 'To share a user profile using email, please login or create an account.',
      handleAction: () => this.refs.shareByEmailModal.show(),
    });
    return (
      <Share
        preferPlace={preferPlace}
        inviteOnly={!!(suser || {}).type}
        showEmbed={showEmbed}
        embed={embed}
        type="profile"
        url={FlowRouter.url('profile', { slug: suser.slug })}
        title={suser.username}
        imageUrl={suser.getImage()}
        handleShareByEmail={handleShareByEmail}
        hideEmail
      >
        <ShareByEmailModal
          userId={userId}
          ref="shareByEmailModal"
        />
      </Share>
    );
  }
}

ShareBtn.propTypes = {
  userId: PropTypes.string,
  suser: PropTypes.object,
  slug: PropTypes.string,
  preferPlace: PropTypes.string,
};

export default composeAll(
  composeWithTracker(data),
  composeWithTracker(loginState)
)(ShareBtn);
