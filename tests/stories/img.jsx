import React from 'react';
import { storiesOf } from '@kadira/storybook';
import Img from '../../imports/ui/components/img.jsx';

const decoratorStyle = {
  textAlign: 'center',
  border: '1px solid black',
  display: 'inline-block',
};

const Decorator = (story) => (
  <div>
    <h2>
      Border to show parent element
    </h2>
    <div style={decoratorStyle}>
      {story()}
    </div>
  </div>
);

const constrainHWStyle = {
  height: '200px',
  maxHeight: '200px',
  overflow: 'hidden',
  display: 'inline-block',
  width: '200px',
  maxWidth: '200px',
};

const ConstrainHeight = ({ children }) => (
  <div style={constrainHWStyle}>
    {children}
  </div>
);

storiesOf('Img', module)
  .addDecorator(Decorator)
  .add('tall parent w set height and width', () => (
    <ConstrainHeight>
      <Img src="http://lorempixel.com/40/400" fullWidth />
    </ConstrainHeight>
  ))
  .add('tall parent w set height and width covering', () => (
    <ConstrainHeight>
      <Img src="http://lorempixel.com/40/400" fullWidth cover />
    </ConstrainHeight>
  ));
