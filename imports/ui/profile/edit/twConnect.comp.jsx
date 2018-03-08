import React from 'react';
import connectBtnHoc from './connectBtnHoc.jsx';
import { twitter } from '../../style.js';

export default connectBtnHoc({
  label: 'Twitter',
  icon: <i className="fa fa-twitter" aria-hidden="true"></i>,
  activeColor: '#1da1f2',
});
