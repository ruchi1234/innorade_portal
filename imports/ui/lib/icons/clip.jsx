import iconHOC from './iconHOC.jsx';
import { scampi, edward } from '../../style';

const srcFunc = ({ active, hover, fill }) => {
  const color = fill || ((hover || active) ? scampi : edward);
  return `<svg xmlns='http://www.w3.org/2000/svg' xmlns:xlink='http://www.w3.org/1999/xlink' viewBox='0 0 16 16'><circle fill='none' stroke='${color}' stroke-width='0.75' stroke-miterlimit='10' cx='7.735' cy='7.734' r='7.36'/> <path fill='${color}' d='M11.014,4.743c-0.46-0.477-1.073-0.737-1.726-0.737c-0.653,0-1.267,0.261-1.728,0.737L4.303,8.108 c-0.739,0.766-0.739,2.011,0,2.776c0.363,0.375,0.846,0.579,1.361,0.579c0.513,0,0.998-0.204,1.359-0.58l2.436-2.516 c0.539-0.559,0.539-1.462,0-2.02C9.194,6.075,8.841,5.925,8.468,5.925c-0.378,0-0.73,0.15-0.995,0.423L5.642,8.24l0.521,0.506 l1.833-1.892C8.123,6.722,8.29,6.649,8.468,6.649c0.175,0,0.345,0.072,0.472,0.205c0.27,0.277,0.27,0.731,0,1.009L6.502,10.38 c-0.449,0.464-1.228,0.464-1.678,0c-0.471-0.487-0.471-1.279,0-1.768l3.259-3.364c0.323-0.334,0.752-0.518,1.206-0.518 c0.455,0,0.882,0.184,1.205,0.516c0.674,0.696,0.674,1.829,0,2.525L7.84,10.511l0.52,0.507l2.654-2.742 C11.958,7.301,11.958,5.717,11.014,4.743'/></svg>`;
};

export default iconHOC({ srcFunc });