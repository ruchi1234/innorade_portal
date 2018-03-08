import iconHOC from './iconHOC.jsx';
import { scampi, edward } from '../../style';

const srcFunc = ({ active, hover, fill }) => {
  const color = fill || (hover || active) ? scampi : edward;
  return `<svg xmlns='http://www.w3.org/2000/svg' xmlns:xlink='http://www.w3.org/1999/xlink' viewBox='0 0 16 16'><path d='M15.5 8c0 4.142-3.358 7.5-7.5 7.5C3.857 15.5.5 12.142.5 8 .5 3.857 3.857.5 8 .5c4.142 0 7.5 3.357 7.5 7.5z' fill='none' stroke='${color}' stroke-width='.748'/><path d='M10.213 8.362c-.14.044-.288.066-.446.066-.444 0-.94-.164-1.468-.335-.626-.205-1.27-.415-1.973-.415-.152 0-.3.01-.448.03V5.036c.14-.044.287-.066.447-.066.443 0 .94.162 1.466.335.624.204 1.27.416 1.973.416.15 0 .3-.01.446-.03v2.67zm-.446-3.454c-1.147 0-2.293-.75-3.44-.75-.42 0-.838.1-1.258.375h-.097v7.31h.73v-3.27c.21-.06.416-.083.624-.083 1.146 0 2.292.75 3.44.75.418 0 .838-.1 1.257-.375V4.533c-.42.275-.84.375-1.258.375' fill='${color}' fill-rule='evenodd' clip-rule='evenodd' stroke-miterlimit='10'/></svg>`;
};

export default iconHOC({ srcFunc });
