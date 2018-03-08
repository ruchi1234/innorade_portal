import iconHOC from './iconHOC.jsx';
import { scampi, edward } from '../../style';

const srcFunc = ({ active, hover, fill }) => {
  const color = fill || ((hover || active) ? scampi : edward);
  return `<svg xmlns='http://www.w3.org/2000/svg' xmlns:xlink='http://www.w3.org/1999/xlink' viewBox='0 0 16 16'><path d='M15.5 8c0 4.142-3.358 7.5-7.5 7.5C3.858 15.5.5 12.142.5 8 .5 3.857 3.858.5 8 .5c4.142 0 7.5 3.357 7.5 7.5z' fill='none' stroke='${color}' stroke-width='.748'/><path d='M12.322 5.82c-.47-.484-1.094-.75-1.76-.75-.664 0-1.29.266-1.758.75l-3.32 3.43c-.755.78-.755 2.05 0 2.83.37.38.86.59 1.385.59.52 0 1.01-.21 1.38-.592l2.482-2.564c.55-.568.55-1.49 0-2.057-.27-.28-.63-.432-1.012-.432-.383 0-.74.153-1.01.432l-1.867 1.93.53.513L9.24 7.972c.13-.135.3-.208.48-.208s.354.073.483.208c.275.282.275.744 0 1.028L7.72 11.565c-.457.473-1.25.473-1.71 0-.48-.497-.48-1.304 0-1.8l3.32-3.43c.33-.34.767-.527 1.23-.527.464 0 .9.188 1.228.526.687.71.687 1.863 0 2.573L9.09 11.7l.53.514 2.7-2.794c.96-.992.96-2.607 0-3.6M5.413 4.248V5.84h1.672v.688H5.413v1.607h-.785V6.528h-1.67V5.84h1.67V4.248h.785z' fill='${color}' fill-rule='nonzero' clip-rule='evenodd' stroke-miterlimit='10'/></svg>`;
};

export default iconHOC({ srcFunc });
