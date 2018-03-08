import React from 'react';

const ModalFooter = ({ children }) => (
  <div className="modal-footer">
    {
      children
    }
  </div>
);

ModalFooter.propTypes = {
  children: React.PropTypes.node,
};

export default ModalFooter;
