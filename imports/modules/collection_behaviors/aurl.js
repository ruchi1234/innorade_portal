// import { Meteor } from 'meteor/meteor';
// import { _ } from 'meteor/underscore';
// import { SimpleSchema } from 'meteor/aldeed:simple-schema';
// // import DenormUserHelpers from '/imports/modules/denorm_user_helpers';
// import { ParentToChild } from '/imports/modules/denormalize';
//
// const Schema = new SimpleSchema({
//   aurl: {
//     type: String,
//     optional: true,
//     //regEx: SimpleSchema.RegEx.Url
//   },
// });
//
// const Helpers = {
//   getAURL() {
//     return this.aurl;
//   },
// };
//
// const attachBehaviour = (Collection) => {
//   Collection.attachSchema(Schema);
//   Collection.helpers(Helpers);
//
//   ParentToChild({
//     parentCollection: Meteor.users,
//     shouldUpdate(parentDoc, previousParentDoc) {
//       return !_.isEqual(
//         // Meteor.users._transform(parentDoc).denormalizedDoc(),
//         // Meteor.users._transform(previousParentDoc).denormalizedDoc()
//       );
//     },
//
//     childCollection: Collection,
//     childFieldName: 'aurl',
//     calcModifier(parentDoc) {
//       console.log({ $set: { creator: Meteor.users._transform(parentDoc).denormalizedDoc() } });
//       return { $set: { creator: Meteor.users._transform(parentDoc).denormalizedDoc() } };
//     },
//   });
//
//   if (Meteor.isServer) {
//     Collection._ensureIndex({ 'creator.name': 1 });
//     Collection._ensureIndex({ creatorId: 1 });
//   }
// };
//
//
// export default attachBehaviour;
// export { Schema };
