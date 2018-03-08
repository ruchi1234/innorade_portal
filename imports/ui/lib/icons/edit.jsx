import iconHOC from './iconHOC.jsx';
import { scampi, edward } from '../../style';

const srcFunc = ({ active, hover }) => {
  const color = (hover || active) ? scampi : edward;
  return `<svg xmlns='http://www.w3.org/2000/svg' xmlns:xlink='http://www.w3.org/1999/xlink' viewBox='0 0 16 16'><path d='M15.5 8c0 4.142-3.357 7.5-7.5 7.5C3.858 15.5.5 12.142.5 8 .5 3.858 3.858.5 8 .5c4.143 0 7.5 3.358 7.5 7.5z' fill='none' stroke='${color}' stroke-width='.748'/><path d='M10.557 3.87l-.787.788 1.574 1.572.787-.787-1.57-1.573zM9.375 5.05L5.05 9.378l1.573 1.572 4.326-4.327L9.372 5.05zM4.762 9.9l-.89 2.23 2.228-.892L4.762 9.9z' fill='${color}' fill-rule='nonzero' clip-rule='evenodd' stroke-miterlimit='10'/></svg>`;
};

export default iconHOC({ srcFunc });
