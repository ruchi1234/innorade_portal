/* global utu */
import React, { PropTypes } from 'react';
import mixpanel from 'mixpanel-browser';
import ClipPlusIcon from '../lib/icons/clipPlus';
import showClipModal from '../components/clip/add_modal';


const Clip = ({ boardId }) => {
  const handleClip = () => {
    showClipModal({ boardId });
    mixpanel.track('Add Prod from Board', {
      boardId,
    });
    utu.track('Add Prod from Board', {
      boardId,
    });
  };

  return <ClipPlusIcon onClick={handleClip} />;
};

Clip.propTypes = {
  boardId: PropTypes.string.isRequired,
};

export default Clip;
