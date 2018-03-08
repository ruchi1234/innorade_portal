const Categories = new Mongo.Collection('categories');

const Schema = new SimpleSchema({
  caption: {
      type: String,
      optional: true
  },
  images: {
      type: [Object],
      autoValue: function () {
          if (this.isInsert && !this.isSet) {
              return [];
          }
      }
  },
  'images.$.href': {
    type: SimpleSchema.RegEx.URL,
  },
  order: {
      type: Number
  },
  questions: {
      type: [Object],
      optional: true,
      autoValue: function () {
          if (this.isInsert && !this.isSet) {
                return [];
          }
      }
  },
  "questions.$.order": {
      type: Number,
      optional: false
  },
  "questions.$.question": {
      type: String,
      optional: false
  },
  title: {
      type: String,
      optional: true
  },
});

Categories.attachSchema(Schema);
Categories.attachBehaviour('timestampable');

export default Categories;
