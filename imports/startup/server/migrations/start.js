import { Meteor } from 'meteor/meteor';
import { Migrations } from 'meteor/percolate:migrations';
import { recacheBoards, recacheClips, recacheUsers } from './recache';

import './20.js';
import './21.js';
import './22.js';
import './23.js';
import './24.js';
import './25.js';
import './26.js';
import './27.js';
import './28.js';
import './29.js';
import './30.js';
import './31.js';
import './32.js';
import './33.js';
import './34.js';
import './35.js';
import './36.js';
import './37.js';
import './38.js';
import './39.js';
import './40.js';

recacheBoards(41);
recacheClips(42);
recacheUsers(43);

recacheBoards(44);
recacheUsers(45);

import './46.js';

recacheUsers(47);

Meteor.setTimeout(() => {
  console.log('Running migrations');
  Migrations.migrateTo(47);
}, 10000);
