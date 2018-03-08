import React from 'react';

export default ({ width, height }) => (
  <iframe
    width={width || '100%'}
    height={height || '365px'}
    src="https://www.youtube.com/embed/LLjPJqSgABQ"
    frameBorder="0"
    allowFullScreen
  />
);
