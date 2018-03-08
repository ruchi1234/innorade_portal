import React from 'react';
import connectBtnHoc from './connectBtnHoc.jsx';
import { facebook } from '../../style.js';

export default connectBtnHoc({
  label: 'Facebook',
  icon: <i className="fa fa-facebook" aria-hidden="true"></i>,
  activeColor: facebook,
});
