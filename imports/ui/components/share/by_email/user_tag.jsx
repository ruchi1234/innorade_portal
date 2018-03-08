import React from 'react';
import Img from '/imports/ui/components/img';

const UserTag = ({ label, onSelected, imageSrc }) => {
  const handleClick = (e) => { e.preventDefault(); onSelected(); };

  return (
    <a onClick={handleClick} className="user-tag">
      {imageSrc && <Img src={imageSrc} circle />}
      <p>{label}</p>
    </a>
  );
};

UserTag.propTypes = {
  imageSrc: React.PropTypes.string,
  label: React.PropTypes.string.isRequired,
  onSelected: React.PropTypes.func.isRequired,
};

export default UserTag;
