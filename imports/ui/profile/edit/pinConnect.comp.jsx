import React from 'react';
import connectBtnHoc from './connectBtnHoc.jsx';
import { pinterest } from '../../style.js';

export default connectBtnHoc({
  label: 'Pinterest',
  icon: <i className="fa fa-pinterest fa-2" aria-hidden="true"></i>,
  activeColor: pinterest,
});
