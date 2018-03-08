// This should probably be changed to before insert to reduce an
// extra db call. Low impact currently though
const ParentToChild = (options) => {
  const {
    parentCollection,
    shouldUpdate,

    childCollection,
    childFieldName,
    calcModifier,
    directUpdate,
  } = options;

  childCollection.after.insert((userId, doc) => {
    const query = { _id: doc[childFieldName] };
    const parent = parentCollection.findOne(query);
    if (parent) {
      const modifier = calcModifier(parent);
      if (modifier) {
        childCollection.update({ _id: doc._id }, calcModifier(parent));
      }
    }
  });

  parentCollection.after.update(function (userId, doc) {
    if (shouldUpdate(doc, this.previous)) {
      const query = {};
      query[childFieldName] = doc._id;
      if (!directUpdate) {
        childCollection.update(query, calcModifier(doc), { multi: true });
      } else {
        childCollection.direct.update(query, calcModifier(doc), { multi: true });
      }
    }
  });
};

/*
 * ChildParent query func is useful
 * when it's more complicated than just
 * reading a field for the parent's id
 */
const ChildAggregate = (options) => {
  const {
    parentField,
    parentCollection,

    childCollection,
    childValue,
    childParentField,
  } = options;

  /**
   * If they're not using the childParentQueryFunc
   * argument
   */
  let childParentQueryFunc;
  if (!options.childParentQueryFunc) {
    // interesting linter doesn't seem to work well with return obj from fat arrow
    childParentQueryFunc = (child) => {
      return { _id: child[childParentField] };
    };
  } else {
    childParentQueryFunc = options.childParentQueryFunc;
  }

  const incParent = (userId, doc, value) => {
    const modifier = { $inc: {} };
    modifier.$inc[parentField] = value;
    parentCollection.update(childParentQueryFunc(doc), modifier);
  };

  childCollection.after.insert((userId, doc) => {
    incParent(userId, doc, childValue(doc));
  });

  childCollection.after.update(function(uid, doc) {
    const val = childValue(doc);
    const prevVal = childValue(this.previous);
    if (doc._id !== this.previous._id) {
      incParent(uid, doc, val);
      incParent(uid, this.previous, -prevVal);
    } else if (prevVal !== val) {
      incParent(uid, doc, (val - prevVal));
    }
  });

  childCollection.after.remove(function(uid, doc) {
    incParent(uid, doc, -childValue(doc));
  });

  // Create a reset function
  const fieldLabel = `${parentField.charAt(0).toUpperCase()}${parentField.slice(1)}`;
  const resetName = `resetAll${fieldLabel}s`;
  parentCollection[resetName] = () => {
    parentCollection.find().forEach((p) => {
      const query = {};
      query[childParentField] = p._id;


      let sum = 0;
      childCollection.find(query).forEach((c) => {
        sum += childValue(c);
      });

      const modifier = {};
      modifier[parentField] = sum;

      parentCollection.update({ _id: p._id }, {
        $set: modifier,
      });
    });
  };
};

const CountCollection = (options) => {
  const {
    countCollection,
    countField,
    countDocQuery,

    countedCollection,
  } = options;

  countedCollection.after.insert((userId, doc) => {
    const modifier = { $inc: {} };
    modifier.$inc[countField] = 1;
    if (!countCollection.findOne(countDocQuery(userId, doc))) {
      const toInsert = countDocQuery(userId, doc);
      if (toInsert) {
        countCollection.insert(toInsert);
      }
    }
    countCollection.update(countDocQuery(userId, doc), modifier);
  });

  countedCollection.after.remove((userId, doc) => {
    const modifier = { $inc: {} };
    modifier.$inc[countField] = -1;
    countCollection.update(countDocQuery(userId, doc), modifier);
  });
};

const attachCountField = (collection, name) => {
  // Have to do special shit for upsert
  collection.before.upsert((userId, selector, modifier) => {
    const mod = Object.assign({}, modifier);
    if (!mod.$setOnInsert) { mod.$setOnInsert = {}; }
    mod.$setOnInsert[name] = 0;
    return mod;
  });

  const schema = {};
  schema[name] = {
    type: Number,
    optional: true,
    autoValue() {
      if (!this.isFromTrustedCode) {
        this.unset();
      }
    },
  };

  collection.attachSchema(new SimpleSchema(schema));
};

export { ParentToChild, ChildAggregate, CountCollection, attachCountField };
