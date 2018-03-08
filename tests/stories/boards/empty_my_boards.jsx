import React from 'react';
import { storiesOf, action } from '@kadira/storybook';
import Empty from '../../../imports/ui/components/boards/my/empty/empty.jsx';
import EmptyNonuser from '../../../imports/ui/components/boards/my/empty/nonuser.comp.jsx';

storiesOf('My board empty state', module)
  .add('logged in', () => (
    <Empty />
  ))
  .add('logged out', () => (
    <EmptyNonuser
      handleLogin={action('handle login')}
      handleBuildBoard={action('handle build board')}
    />
  ));
