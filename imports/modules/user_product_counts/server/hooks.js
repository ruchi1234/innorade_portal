import BoardProducts from '/imports/modules/clips/collection';
import UserProductCounts from '/imports/modules/user_product_counts/collection';
import { CountCollection } from '/imports/modules/denormalize';

CountCollection({
  countCollection: UserProductCounts,
  countField: 'count',
  countDocQuery(userId, doc) {
    const bp = BoardProducts._transform(doc);
    if (bp.creator) {
      return { userId: bp.creatorId, productId: doc.productId };
    }
  },

  countedCollection: BoardProducts,
});
