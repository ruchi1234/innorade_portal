export default (percent) => ({
  MsTransform: `translateY(${percent}%)`,
  WebkitTransform: `translateY(${percent}%)`,
  MozTransform: `translateY(${percent}%)`,
  OTransform: `translateY(${percent}%)`,
  transform: `translateY(${percent}%)`,
});
