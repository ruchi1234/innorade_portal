import { Meteor } from 'meteor/meteor';
import { _ } from 'meteor/underscore';

const { defaultImage: DEFAULT_IMAGE } = Meteor.settings.public.users;

const DenormUserHelpers = function (obj) {
  return _.extend({}, obj, {
    fullLabel() {
      if (this.fullname) {
        return `${this.fullname} (${this.username})`;
      } else {
        return this.username;
      }
    },

    getImage() {
      return this.imageUrl || Meteor.absoluteUrl(DEFAULT_IMAGE);
    },
  });
};

export default DenormUserHelpers;
