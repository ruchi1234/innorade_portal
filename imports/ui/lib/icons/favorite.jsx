import iconHOC from './iconHOC.jsx';
import { scampi, edward } from '../../style';

const srcFunc = ({ active, hover }) => {
  if (active) {
    return `<svg xmlns='http://www.w3.org/2000/svg' xmlns:xlink='http://www.w3.org/1999/xlink' viewBox='0 0 16 16'><g fill-rule='evenodd' clip-rule='evenodd' stroke-miterlimit='1.414'><path d='M15.5 8c0 4.142-3.358 7.5-7.5 7.5C3.857 15.5.5 12.142.5 8 .5 3.857 3.857.5 8 .5c4.142 0 7.5 3.357 7.5 7.5z' fill='${scampi}' stroke-width='.75' stroke='#fff'/><path d='M10.146 4.1c-.912 0-1.708.55-2.146 1.27-.438-.72-1.234-1.27-2.147-1.27C4.47 4.1 3.35 5.204 3.35 6.566c0 .68.272 1.305.716 1.76C5.072 9.363 8 12.556 8 12.556s2.928-3.193 3.935-4.23c.443-.455.715-1.08.715-1.76 0-1.362-1.12-2.466-2.504-2.466' fill='#fff' fill-rule='nonzero'/></g></svg>`;
  }

  const color = hover ? scampi : edward;
  return `<svg xmlns='http://www.w3.org/2000/svg' xmlns:xlink='http://www.w3.org/1999/xlink' viewBox='0 0 16 16'><g fill-rule='evenodd' clip-rule='evenodd' stroke-miterlimit='1.414'><path d='M15.5 8c0 4.142-3.358 7.5-7.5 7.5C3.857 15.5.5 12.142.5 8 .5 3.857 3.857.5 8 .5c4.142 0 7.5 3.357 7.5 7.5z' fill='none' stroke-width='.75' stroke='${color}' /><path d='M10.146 4.1c-.912 0-1.708.55-2.146 1.27-.438-.72-1.234-1.27-2.147-1.27C4.47 4.1 3.35 5.204 3.35 6.566c0 .68.272 1.305.716 1.76C5.072 9.363 8 12.556 8 12.556s2.928-3.193 3.935-4.23c.443-.455.715-1.08.715-1.76 0-1.362-1.12-2.466-2.504-2.466' fill='${color}' fill-rule='nonzero'/></g></svg>`;
};

export default iconHOC({ srcFunc });
