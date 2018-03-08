import Subscriptions from '/imports/data/subscriptions';
import Products from '/imports/modules/products/collection';

export default (props, onData) => {
  const sub = Subscriptions.subscribe('products.byId', props.productId);

  const product = Products.findOne(props.productId);
  if (product) {
    product.creator = product.creator || {};
  }

  onData(null, {
    product,
    ready: sub.ready(),
  });

  return () => { sub.stop(); };
};
