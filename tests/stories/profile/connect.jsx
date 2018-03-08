import React from 'react';
import { storiesOf } from '@kadira/storybook';
import FbConnect from '../../../imports/ui/profile/edit/fbConnect.comp.jsx';
import TwConnect from '../../../imports/ui/profile/edit/twConnect.comp.jsx';
import InstaConnect from '../../../imports/ui/profile/edit/instaConnect.comp.jsx';
import PinConnect from '../../../imports/ui/profile/edit/pinConnect.comp.jsx';

storiesOf('Profile edit', module)
  .add('connected options', () => (
    <div>
      <FbConnect connected />
      <TwConnect connected />
      <PinConnect connected />
      <InstaConnect connected />
    </div>
  ))
  .add('not connected options', () => (
    <div>
      <FbConnect />
      <TwConnect />
      <PinConnect />
      <InstaConnect />
    </div>
  ))
  .add('connected and removable', () => (
    <div>
      <FbConnect connected handleRemove={() => {}} />
      <TwConnect connected handleRemove={() => {}} />
      <PinConnect connected handleRemove={() => {}} />
      <InstaConnect connected handleRemove={() => {}} />
    </div>
  ));
