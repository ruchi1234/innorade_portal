import iconHOC from './iconHOC.jsx';
import { edward } from '../../style';

const srcFunc = () => (
  `<svg xmlns='http://www.w3.org/2000/svg' xmlns:xlink='http://www.w3.org/1999/xlink' viewBox='0 0 16 16'><path d='M10.55 11.64l-.974.972L8 11.035l-1.576 1.577-.973-.972 1.58-1.577-1.58-1.576.975-.972L8 9.092l1.576-1.577.973.972-1.58 1.576 1.577 1.577zM8 4.562c-1.003 0-1.94.273-2.75.743v-.743c0-1.465 1.284-2.75 2.75-2.75.733 0 1.42.32 1.925.826l.974-.973C10.143.91 9.112.437 8 .437c-2.23 0-4.126 1.897-4.126 4.125v1.873C3.02 7.405 2.5 8.67 2.5 10.063c0 3.037 2.464 5.5 5.5 5.5 3.038 0 5.5-2.463 5.5-5.5s-2.462-5.5-5.5-5.5' fill='${edward}' fill-rule='nonzero' clip-rule='evenodd' stroke-linejoin='round' stroke-miterlimit='1.414'/></svg>`
);

export default iconHOC({ srcFunc, defaultSize: 14 });
