import iconHOC from './iconHOC.jsx';
import { scampi, edward } from '../../style';

const srcFunc = ({ active, hover, fill }) => {
  const color = fill || ((hover || active) ? scampi : edward);
  return `<svg xmlns='http://www.w3.org/2000/svg' xmlns:xlink='http://www.w3.org/1999/xlink' viewBox='0 0 16 16'><path d='M15.5 8c0 4.142-3.358 7.5-7.5 7.5C3.858 15.5.5 12.142.5 8 .5 3.858 3.858.5 8 .5c4.142 0 7.5 3.358 7.5 7.5z' fill='none' stroke='${color}' stroke-width='.748'/><path d='M9 9.442c-.212 0-.41.05-.59.136l-1.03-1.03c.076-.168.12-.354.12-.55 0-.198-.044-.385-.12-.552L8.407 6.42c.18.088.38.138.593.138.743 0 1.344-.603 1.344-1.344 0-.743-.6-1.344-1.344-1.344-.743 0-1.344.6-1.344 1.344 0 .18.036.35.1.508l-1.05 1.05c-.167-.076-.354-.118-.55-.118-.743 0-1.345.6-1.345 1.343 0 .742.605 1.344 1.348 1.344.196 0 .383-.04.55-.116l1.052 1.052c-.066.157-.103.33-.103.512 0 .742.6 1.344 1.344 1.344.745 0 1.346-.6 1.346-1.343S9.746 9.442 9 9.442' fill='${color}' fill-rule='nonzero' clip-rule='evenodd' stroke-miterlimit='1.414'/></svg>`;
};

export default iconHOC({ srcFunc });
