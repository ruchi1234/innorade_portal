import BoardProducts from '/imports/modules/clips/collection';
import Products from '/imports/modules/products/collection';
// import { generateAurl } from '/imports/lib/server/affiliate/affiliate_generator';
import { attachCountField, ChildAggregate } from '/imports/modules/denormalize';

// NOTE: keep this hook in the code in case it comes back.
// Products.setAurl = (doc) => {
//   const aurl = generateAurl(doc.domain, doc.url, doc._id);
//   Products.update(
//     { _id: doc._id },
//     { $set: { aurl } }
//   );
// };
// const hookUpdatePrevious = (userId, doc) => { Products.setAurl(doc); };
// const hookDontFetchPrev = { fetchPrevious: false };
// Products.after.insert(hookUpdatePrevious, hookDontFetchPrev);

// Products.addContributor = (doc) => {
//   console.log('firing addContributor hook');
//   Products.update({ _id: doc._id },
//       { $addToSet:
//           { contributedByIds: this.userId },
//       }
//   );
// };
//
// const hookUpdatePrevious = (userId, doc) => { Products.addContributor(doc); };
// const hookDontFetchPrev = { fetchPrevious: false };
// Products.after.insert(hookUpdatePrevious, hookDontFetchPrev);
// Products.before.update(hookUpdatePrevious, hookDontFetchPrev);

/*
* Track number of times a product's board products have been
* favorited
*/

attachCountField(Products, 'clipFavoritedCount');

ChildAggregate({
  parentField: 'clipFavoritedCount',
  parentCollection: Products,

  childCollection: BoardProducts,
  childValue(childDoc) {
    const bp = BoardProducts._transform(childDoc);
    return bp.favoritedByIds ? bp.favoritedByIds.length : 0;
  },
  childParentField: 'productId',
});

/*
 * Tracks number of times clipped
 */
attachCountField(Products, 'clipCount');

ChildAggregate({
  parentField: 'clipCount',
  parentCollection: Products,

  childCollection: BoardProducts,
  childValue(childDoc) { return !childDoc.removed ? 1 : 0; },
  childParentField: 'productId',
});
