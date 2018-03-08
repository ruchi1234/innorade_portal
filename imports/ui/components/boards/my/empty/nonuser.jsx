import React from 'react';
import Empty from './nonuser.comp.jsx';
import { showLogin, showRegister } from '/imports/ui/components/login/modal';


export default () => (
  <Empty handleLogin={showLogin} handleBuildBoard={showRegister} />
);
