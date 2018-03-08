import { Meteor } from 'meteor/meteor';
import { _ } from 'meteor/underscore';
import { check, Match } from 'meteor/check';
import { Email } from 'meteor/email';
import { Kadira } from 'meteor/meteorhacks:kadira';
const Users = Meteor.users;
import { Accounts } from 'meteor/accounts-base';
import Contacts from '/imports/modules/contacts/collection';
import ContactEmails from '/imports/modules/contact_emails/collection';
import { CalculateQuery } from '/imports/modules/calculate_query';
import inviteMethodHOF from '/imports/modules/invitations/methodHOF';
import Invitations from '/imports/modules/invitations/collection';

function removeSpecialChars(str) {
  return str.replace(/(?!\w|\s)./g, '')
    .replace(/\s+/g, '')
    .replace(/^(\s*)([\W\w]*)(\b\s*$)/g, '$2');
}

Meteor.methods({
  sendVerificationLink() {
    if (Meteor.isServer) {
      const userId = Meteor.userId();
      if (userId) {
        return Accounts.sendVerificationEmail(userId);
      }
    }
  },

  /**
  * Update user account.
  * @param {object} data - data object to update existing user profile.
  */
  updateUserAccount: function updateUserAccount(data) {
    check(data, Object);

    const modifier = {
      $set: {},
      $unset: {},
    };

    if (data.bio) {
      modifier.$set['profile.bio'] = data.bio;
    }

    if (data.firstName) {
      modifier.$set['profile.firstName'] = data.firstName;
    }

    if (data.images) {
      modifier.$set['profile.images'] = data.images;
    }

    if (data.lastName) {
      modifier.$set['profile.lastName'] = data.lastName;
    }

    if (data.blogUrl) {
      modifier.$set['profile.blogUrl'] = data.blogUrl;
    } else {
      modifier.$unset['profile.blogUrl'] = 1;
    }

    if (data.retailerUrl) {
      modifier.$set['profile.retailerUrl'] = data.retailerUrl;
    } else {
      modifier.$unset['profile.retailerUrl'] = 1;
    }

    if (data.notificationFlag === true || data.notificationFlag === false) {
      modifier.$set['notificationFlag'] = data.notificationFlag;
    }

    if (data.username) {
      modifier.$set['username'] = data.username;
      modifier.$set['slug'] = data.slug;
    }

    if (data.email) { // blow away existing email list, and replace with this setting unverified.
      modifier.$set['emails'] = _.map([data.email], function (email) {
        return {
          address: email,
          verified: false,
        };
      });
    }

    Users.update({
      _id: this.userId,
    }, modifier);
  },

  /**
  * checks for uniqueness of email
  * @param {String} email - provided email
  * return Boolean
  */
  uniqueEmail(email) {
    check(email, String);
    const u = Users.find({ 'emails.address': email });
    if (u.count() > 0) {
      return false;
    } else {
      return true;
    }
  },

  /**
  * checks for uniqueness of username
  * @param {String} username - provided name
  * return Boolean
  */
  uniqueUserName(userId, username, slug) {
    check(userId, String);
    check(username, String);
    check(slug, String);
    const u = Users.find({ _id: { $nin: [userId] }, $or: [{
      username: new RegExp(["^", username, "$"].join(""), "i"),
    }, {
      slug: new RegExp(["^", slug, "$"].join(""), "i"),
    }] });
    if (u.count() > 0) {
      return false;
    } else {
      return true;
    }
  },

    /**
    * Update user security.
    * @param {object} pwd - data object to update existing user profile.
    */
  updateUserSecurity(data) {
    check(data, Mavenx.schemas.pwdCheck);
    if (data.password) {
      Accounts.setPassword(this.userId, data.password, { logout: false });
    }
  },

    /**
    * Flags the currentUser as being verified.  By default this happens for all
    * oAuth accounts.  This is called when confirming an email.
    */
  verifyUser() {
    try {
      Users.update({ _id: this.userId }, { $set: { verified: true } });
    } catch (err) {
      const type = 'verfiyUser';
      const message = err.message;
      Kadira.trackError(type, message);
      console.error('\n\n', message, '\n\n');
    }
  },
});

if (Meteor.isServer) {
  Meteor.methods({
    'users.referAFriend'(options) {
      check(options.contactIds, [String]);
      check(options.emails, [String]);
      const { contactIds, emails, notes } = options;

      const usersByEmailsQ = CalculateQuery(
        Meteor.users.queryHelpers,
        ['byEmails'],
        { emails }
      );
      const emailsContactIds = [];
      Meteor.users.find(...usersByEmailsQ).forEach((u) => {
        Contacts.ensureExists({ userId: this.userId, contactId: u._id });
        emailsContactIds.push(u._id);
      });

      _.each(emails, (email) => {
        ContactEmails.ensureExists({ userId: this.userId, email });
      });

      /*
       * Send emails
       */

      // Get email addresses for all contacts passed in
      const query = CalculateQuery(
        Meteor.users.queryHelpers,
        ['byIds'],
        { _ids: contactIds }
      );
      const contactEmails = Meteor.users.find(...query).map((u) => u.primaryEmail());

      const inviteURL = `${Meteor.absoluteUrl()}boards?raf=${this.userId}`;
      // console.log('inviteURL: ', inviteURL);
      const trackedInviteUrl = `${Meteor.absoluteUrl()}email-track?url=${encodeURIComponent(inviteURL)}&userId=${this.userId}`;
      // console.log('trackedInviteUrl: ', trackedInviteUrl);

      // Send email to each email address found
      const user = Meteor.users.findOne(this.userId);
      const userName = _.get(user, 'username');
      const userFirstName = _.get(user, 'profile.firstName');
      // Remove emails that didn't get found (i.e. twitter users)
      const sendToEmails = _.filter(_.uniq([...contactEmails, ...emails]), (email) => !!email);
      sendToEmails.forEach((email) => {
        const emailObj = {
          from: `${user.fullName()} at Maven <friend@mavenxinc.com>`,
          userID: this.userId,
          to: email,
          subject: `${user.fullName()} has invited you to join Maven`,
          created: new Date(),
          html: SSR.render(
            'inviteToMaven', {
              ROOT_URL: Meteor.absoluteUrl(),
              senderFirstName: !userFirstName && userName || userFirstName,
              inviteURL: trackedInviteUrl,
              referralComments: notes,
            }
          ),
        };
        Email.send(emailObj);
      });
    },
    'users.disconnectSocial'(social) {
      const user = Meteor.users.findOne({ _id: this.userId });

      if (!user || !user.canDisconnectSocial(social)) {
        throw new Error('Cannot remove service');
      }

      const toUnset = {};
      toUnset[`services.${social}`] = 1;
      switch (social) {
        case 'facebook':
          toUnset['profile.facebookFriends'] = 1;
          toUnset['profile.facebookId'] = 1;
          break;
        case 'twitter':
          toUnset['profile.twitterScreenName'] = 1;
          toUnset['profile.twitterFollowers'] = 1;
          break;
        case 'instagram':
          toUnset['profile.instagramUsername'] = 1;
          toUnset['profile.instagramFollowers'] = 1;
          break;
        case 'pinterest':
        
          toUnset['profile.pinterestFollowers'] = 1;
          toUnset['profile.pinterestUrl'] = 1;
          break;
        default:
          break;
      }
     
      Meteor.users.update({ _id: this.userId }, { $unset: toUnset });
    },
  });

  SSR.compileTemplate('inviteNotificationEmailHTML', Assets.getText('emails/invite.html'));

  Meteor.methods({
    'profile.invite': inviteMethodHOF({
      renderEmail({
        email,
        _id,
        notes,
        fromUser,
      }) {
        const fromUserFirstName = fromUser.informalName();

        const bprod = BoardProducts.findOne(_id);
        const creator = bprod.getCreator();
        const avatar = creator.getImage();
        const userName = creator.username;
        const {
          images,
          caption,
          price,
          title,
          productId,
        } = bprod;
        const length = 250;
        const triCap = () => {
          let response = '';
          if (caption) {
            response = caption.length > length ? `${caption.substring(0, length - 3)}...` : caption;
          } else {
            response = '';
          }
          return response;
        };

        let clipUrl; // is private
        if (bprod.type) {
          clipUrl = Invitations.createLink(_.extend({
            invitingUserId: fromUser._id,
          }, {
            email,
            relatedId: _id,
            relatedType: 'product',
          }));
        } else {
          if (!Can.invite.clip(this.userId, _id)) {
            throw new Error(`Access denied: Trying to share clip ${_id} as user ${this.userId}`);
          }
          clipUrl = `${Meteor.absoluteUrl()}product/${_id}`;
        }

        const trackedClipUrl = `${Meteor.absoluteUrl()}email-track?url=${encodeURIComponent(clipUrl)}&clipId=${_id}`;
        console.log('trackedClipUrl: ', trackedClipUrl);

        let bp0 = '';
        bp0 = _.get(images, '0.href');
        const emailData = {
          inviteUrl: trackedClipUrl,
          userFirstName: fromUserFirstName,
          caption: triCap(),
          bp0,
          boardUrl: trackedClipUrl,
          retailerName: bprod.retailer || '',
          retailerUrl: bprod.aurl || '',
          productName: title,
          referralComments: notes,
          username: userName,
          avatar,
          price,
          ROOT_URL: Meteor.absoluteUrl(),
        };
        return {
          from: `${fromUser.fullName()} at Maven <friend@mavenxinc.com>`,
          userID: fromUser._id,
          to: email,
          subject: 'Check out this product at Maven!',
          created: new Date(),
          html: SSR.render('inviteProduct', emailData),
        };
      },
      // I think ideally, we'll want these removed from inviteMethodHOF
      findDoc: (relatedId) => BoardProducts.findOne(relatedId),
      inviteToDoc: (relatedId, invitedIds) => BoardProducts.update({
        relatedId,
      }, {
        $addToSet: {
          invitedIds: {
            $each: invitedIds,
          },
        },
      }),
    }),
  });
}
