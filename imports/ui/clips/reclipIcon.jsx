import React from 'react';
import canHOF from '../../modules/can/can_hof';
import ReclipIcon from '../lib/icons/clip';
import showReclipModal from '../components/clip/reclip_modal/reclip_modal';


export default (props) => {
  const handleClip = canHOF({
    action: 'insert',
    type: 'clip',
    authDenyMsg: 'To re-clip a product, please login or create an account.',
    handleAction: () => showReclipModal({ clipId: props.clipId }),
  });

  return <ReclipIcon onClick={handleClip} />;
};
