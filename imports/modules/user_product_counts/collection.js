import BoardProducts from '/imports/modules/clips/collection';

const UserProductCounts = new Mongo.Collection('userProductCounts');

const Schema = new SimpleSchema({
  userId: {
    type: SimpleSchema.RegEx.Id,
    denyUpdate: true,
  },
  productId: {
    type: SimpleSchema.RegEx.Id,
    denyUpdate: true,
  },
  count: {
      type: Number,
      defaultValue: 0,
    },
});

UserProductCounts.attachSchema(Schema);

UserProductCounts.resetAllCounts = () => {
  const calc = {};

  const incCalc = (uid, pid) => {
    if (!calc[uid]) {
      calc[uid] = {};
    }

    if (!calc[uid][pid]) {
      calc[uid][pid] = 0;
    }

    calc[uid][pid] = calc[uid][pid] + 1;
  };

  BoardProducts.find().forEach((bp) => {
    if (bp.creator) {
      incCalc(bp.creatorId, bp.productId);
    }
  });

  _.each(calc, (pCounts, userId) => {
    _.each(pCounts, (count, productId) => {
      UserProductCounts.upsert({ userId, productId }, { $set: { userId, productId, count } });
    });
  });
};

export default UserProductCounts;
