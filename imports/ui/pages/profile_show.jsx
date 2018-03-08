import React, { PropTypes } from 'react';

import ProfileDetail from '/imports/ui/profile/show';
import SlugBoards from '/imports/ui/pages/slug_boards';

const Profile = ({ slug }) => (
  <div>
    <ProfileDetail slug={slug} />
    <SlugBoards controller="slug" slug={slug} keyword=""/>
  </div>
);

Profile.propTypes = {
  slug: PropTypes.string.isRequired,
  keyword: PropTypes.string.isRequired,
};

export default Profile;
