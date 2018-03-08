import React from 'react';
import ReactDOM from 'react-dom';
import Modal from '/imports/ui/components/modal';

const modalContainer = document.createElement('div');
document.body.insertBefore(modalContainer, null);
ReactDOM.render(<Modal />, modalContainer);
