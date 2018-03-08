import React from 'react';
import { FlowRouter } from 'meteor/kadira:flow-router';
import Share from '/imports/ui/components/share/share';

const ShareClip = ({ clip, handleShareByEmail, preferPlace }) => {
  if (!clip) { return <span></span>; }

  const affiliateUrl = FlowRouter.url(
    'mixpanelTrack',
    {},
    { url: encodeURIComponent(clip.aurl), clipId: clip._id }
  );
  return (<Share
    url={FlowRouter.url('product', { _id: clip._id })}
    title={clip.title}
    caption={clip.caption}
    imageUrl={clip.getImage()}
    affiliateUrl={affiliateUrl}
    handleShareByEmail={handleShareByEmail}
    preferPlace={preferPlace}
  />);
};

ShareClip.propTypes = {
  clip: React.PropTypes.object,
  handleShareByEmail: React.PropTypes.func.isRequired,
};

export default ShareClip;
