import React from 'react';
import { storiesOf } from '@kadira/storybook';
import { Toolbar, Counts } from '../../../imports/ui/lib/card.jsx';
import Share from '../../../imports/ui/lib/icons/share.jsx';
import Attach from '../../../imports/ui/lib/icons/attach.jsx';

const decoratorStyle = {
  width: '300px',
  border: '1px solid black',
  height: '450px',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'flex-end',
};

const Decorator = (story) => (
  <div>
    <h2>
      Card only includes toolbar so far
      Rest of card is still on old implementation
    </h2>
    <div style={decoratorStyle}>
      {story()}
    </div>
  </div>
);

storiesOf('Generic card', module)
  .addDecorator(Decorator)
  .add('footer', () => (
    <div>
      <div style={{ padding: '12px' }}>
        <Counts
          favorites={3}
          clips={10}
          price={10.01}
        />
      </div>
      <Toolbar>
        <Attach />
        <Share />
      </Toolbar>
    </div>
  ));
