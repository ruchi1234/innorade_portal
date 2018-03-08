import DenormUserHelpers from '/imports/modules/denorm_user_helpers';

const Schema = new SimpleSchema({
  userId: {
    type: SimpleSchema.RegEx.Id,
    denyUpdate: true,
  },
  contactId: {
    type: SimpleSchema.RegEx.Id,
    denyUpdate: true,
  },
  contact: Mavenx.schemas.DenormObjectField,
});

const Contacts = new Mongo.Collection('contacts');
Contacts.attachSchema(Schema);

Contacts.helpers({
  getContact() {
    return DenormUserHelpers(this.contact);
  },
});

Contacts.ensureExists = (doc) => {
  if (!Contacts.findOne(doc)) {
    Contacts.insert(doc);
  }
};

if (Meteor.isServer) {
  Contacts._ensureIndex({ userId: 1, contactId: 1 }, { unique: 1 });
}

export default Contacts;
