import { Meteor } from 'meteor/meteor';
import { SimpleSchema } from 'meteor/aldeed:simple-schema';
import Can from '/imports/modules/can/can';
import { ValidatedMethod } from 'meteor/mdg:validated-method';

const ImageSchema = new SimpleSchema({
  // Do we still need this?
  _id: {
    type: Number,
    optional: true,
  },
  // Do we still need this?
  source: {
    type: String,
    optional: true,
  },
  // Should this be optional?
  href: {
    type: String,
    optional: true,
  },
  // Do we still need this?
  html: {
    type: String,
    optional: true,
  },
  creatorId: {
    type: SimpleSchema.RegEx.Id,
    optional: true,
  },
  createdAt: {
    type: Date,
    optional: true,
  },
});

const createSchema = (Collection, { subDocField }) => {
  const schema = {};
  const fieldPath = subDocField ? `${subDocField}.images` : 'images';
  schema[fieldPath] = {
    type: [ImageSchema],
    defaultValue: [],
  };

  return new SimpleSchema(schema);
};

const createApis = (Collection, options) => {
  const { subDocField } = options;
  let collectionAlias = Collection.getName();
  const fieldPath = subDocField ? `${subDocField}.images` : 'images';
  // Ugly stripping of 's' at end of collection name
  // Any better way to remove this?
  collectionAlias = collectionAlias.substring(0, collectionAlias.length - 1);

  const apis = {};

  apis.addImage = new ValidatedMethod({
    name: `${collectionAlias}.addImage`,

    validate: new SimpleSchema({
      _id: {
        type: String,
      },
      image: {
        type: ImageSchema,
      },
    }).validator(),

    run({ _id, image }) {
      if (!Can.update[collectionAlias](this.userId, _id)) {
        throw new Meteor.Error(`Access denied.  Cannot update ${collectionAlias}`);
      }
      console.log("running add image");
      // const modifier = { $push: {} };
      // modifier.$push[fieldPath] = addedImage;

      const addedImage = Object.assign({}, image);
      addedImage.createdAt = new Date();
      addedImage.creatorId = this.userId;
      const modifier = { $push: {} };
      modifier.$push[fieldPath] = { $each: [addedImage], $position: 0 };
      console.log('modifier: ', modifier);
      // const modifier = {
      //   $push: {
      //     [fieldPath]: {
      //       $each: [addedImage],
      //       $position: 0,
      //     },
      //   },
      // };
      Collection.update({ _id }, modifier);
    },
  });

  apis.moveImage = new ValidatedMethod({
    name: `${collectionAlias}.moveImage`,

    validate: new SimpleSchema({
      _id: {
        type: SimpleSchema.RegEx.Id,
      },
      newIndex: {
        type: Number,
      },
      oldIndex: {
        type: Number,
      },
    }).validator(),

    run({ _id, newIndex, oldIndex }) {
      if (!Can.update[collectionAlias](this.userId, _id)) {
        throw new Meteor.Error(`Access denied.  Cannot update ${collectionAlias}`);
      }

      const doc = Collection.findOne({ _id });
      let imgz;
      if (subDocField) {
        imgz = doc && doc[subDocField] && doc[subDocField].images || [];
      } else {
        imgz = doc && doc.images || [];
      }
      const myimage = imgz.splice(oldIndex, 1);
      imgz.splice(newIndex, 0, myimage[0]);
      const modifier = { $set: {} };
      modifier.$set[fieldPath] = imgz;
      Collection.update({ _id }, modifier);
    },
  });

  apis.removeImage = new ValidatedMethod({
    name: `${collectionAlias}.removeImage`,

    validate: new SimpleSchema({
      _id: {
        type: SimpleSchema.RegEx.Id,
      },
      imageHref: {
        type: SimpleSchema.RegEx.Id,
      },
    }).validator(),

    run({ _id, imageHref }) {
      if (!Can.update[collectionAlias](this.userId, _id)) {
        throw new Meteor.Error(`Access denied.  Cannot update ${collectionAlias}`);
      }

      const modifier = { $pull: {} };
      modifier.$pull[fieldPath] = { href: imageHref };

      Collection.update({ _id }, modifier);
    },
  });

  return apis;
};

const createHelpers = (Collection, { defaultImage, subDocField }) => (
  {
    getImage(opts) {
      const { index = 0, field = 'href' } = (opts || {});

      const imgs = subDocField ? (this[subDocField] && this[subDocField].images) : this.images;

      const img = ((imgs || []).length > index) ? imgs[index] : { href: defaultImage };
      return img ? img[field] : { href: defaultImage }[field];
    },
  }
);

const attachBehaviour = (Collection, options) => {
  const opts = _.extend({}, {}, options);
  Collection.attachSchema(createSchema(Collection, opts));

  Collection.attachApi(createApis(Collection, opts));

  Collection.helpers(createHelpers(Collection, opts));
};

export default attachBehaviour;
