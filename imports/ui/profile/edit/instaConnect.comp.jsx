import React from 'react';
import connectBtnHoc from './connectBtnHoc.jsx';
import { instagram } from '../../style.js';

export default connectBtnHoc({
  label: 'Instagram',
  icon: <i className="fa fa-instagram" aria-hidden="true"></i>,
  activeColor: instagram,
});
