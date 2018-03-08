import React from 'react';
import { storiesOf, action } from '@kadira/storybook';
import Empty from '../../../imports/ui/components/boards/no_products.jsx';

storiesOf('Board without products message', module)
  .add('', () => (
    <Empty handleClip={action('reclip')} />
  ));
