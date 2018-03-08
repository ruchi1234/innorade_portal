import { _ } from 'meteor/underscore';

const CalculateQuery = (helpers, mixins, helperParams) => {
  // Find access layer
  const defaultMixins = helpers.canAccess ? ['canAccess'] : [];

  // Unique the array of mixins, filter out undefineds
  const queryMixins = _.map([..._.uniq(mixins), ...defaultMixins], (h) => {
    if (helpers[h] === undefined) {
      console.error(`Query helper ${h} not found`);
      return undefined;
    }
    return helpers[h](helperParams);
  });

  // Condense back to single array representing query
  const q = _.reduce(queryMixins, (query, mixin) => {
    if (!mixin) { return query; }

    const find = _.extend({}, query[0]);
    // clone, don't overwrite
    if (_.keys(mixin[0]).length > 0) {
      if (mixin[0].$and) {
        const and = mixin[0].$and;
        delete mixin[0].$and;
        find.$and = [...query[0].$and, ...and];
        if (_.keys(mixin[0]).length > 0) {
          find.$and.push(...mixin[0]);
        }
      } else {
        find.$and = [...query[0].$and, mixin[0]];
      }
    }

    return [
      find,
      _.extend(query[1], mixin[1]),
      _.extend(query[2], mixin[2]),
    ];
  }, [{ $and: [] }, {}, {}]);

  if (CalculateQuery.debug) {
    console.log(q);
  }

  return q;
};

CalculateQuery.debug = false;

export default CalculateQuery;
export { CalculateQuery };
