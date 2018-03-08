import { Meteor } from 'meteor/meteor';
import { check, Match } from 'meteor/check';
import { Kadira } from 'meteor/meteorhacks:kadira';
const Users = Meteor.users;
import Contacts from '/imports/modules/contacts/collection';

Meteor.methods({

  setMxpDid(mxpdid, leadSource, raf, ip) {
    check(mxpdid, String);
    check(leadSource, Match.Optional(String));

    const cusr = Meteor.user();

    try {
      Users.update({ _id: cusr._id }, { $set: {
        mxpdid,
        'profile.mxpdid': mxpdid,  // FIXME: is this 2nd mxpdid needed?
        'profile.referralSource': raf,
        'profile.leadSource': leadSource,
        'profile.createdIp': ip } });
    } catch (err) {
      const type = 'setMxpDid';
      const message = err.message;
      Kadira.trackError(type, message);
      console.log('\n\n', message, '\n\n');
    }

    Meteor.setTimeout(() => {
      try {
        Meteor.call('geoJsonForIp', ip, (e, r) => {
          if (r) {
            Users.update({ _id: cusr._id }, { $set: {
              'profile.location': r,
            } });
          }
        });
      } catch (err) {
        const type = 'setMxpDid > geoJsonForIp';
        const message = err.message;
        Kadira.trackError(type, message);
        console.log('\n\n', message, '\n\n');
      }
    }, 2);

    if (leadSource.charAt(0) === 'm') { // have a referral
      const referrer = {
        userId: cusr._id,
        contactId: leadSource.substr(1), /* trim 'm'*/
      };
      const referree = {
        userId: leadSource.substr(1),
        contactId: cusr._id,
      };

      Contacts.insert(referrer);
      Contacts.insert(referree);
    }
  },
});
