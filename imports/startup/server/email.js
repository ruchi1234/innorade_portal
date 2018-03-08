import { Meteor } from 'meteor/meteor';
import { Accounts } from 'meteor/accounts-base';
import { SSR } from 'meteor/meteorhacks:ssr';

Meteor.startup(function () {

  // email settup
  process.env.MAIL_URL = Meteor.settings.services.mailgun.smtpUrl;
  Accounts.emailTemplates.from = 'Maven <no-reply@mavenx.com>';
  Accounts.emailTemplates.siteName = 'www.mavenx.com';  // -- Application name

  Accounts.emailTemplates.resetPassword = {
    subject() {
      return 'Reset Your Maven Password Request!';
    },
    html(user, url) {
      const token = url.substring(url.lastIndexOf('/') + 1, url.length);
      const newUrl = Meteor.absoluteUrl(`resetp/${token}`);
      const emailData = {
        firstName: user.profile.firstName,
        ROOT_URL: Meteor.absoluteUrl(),
        url: newUrl,
      };
      return (SSR.render('reset-password', emailData));
    },
  };

  Accounts.emailTemplates.verifyEmail = {
    subject() {
      return 'Verify Your Maven Email Address to Start Sharing and Clipping!';
    },
    html(user, url) {
      const emailData = {
        url,
        ROOT_URL: Meteor.absoluteUrl(),
      };
      return (
        SSR.render(
          'verify-email',
          emailData
        )
      );
    },
  };

  Accounts.config({
    sendVerificationEmail: true,
  });
});

// //Accounts.emailTemplates.from = Meteor.settings.emails.info;
// -- Subject line of the email.
// Accounts.emailTemplates.verifyEmail.subject = function(user) {
//   return 'Confirm Your Email Address for Maven';
// };
// -- Email text
// Accounts.emailTemplates.verifyEmail.text = function(user, url) {
//   let str = 'Thank you for registering. ';
//   str += 'Please click on the following link to verify your email address: \r\n';
//   str += url;
//   return str;
// };
// -- Email text
// Accounts.emailTemplates.verifyEmail.text = function(user, url) {
//   return 'Thank you for registering.  Please click on the following link to verify
// your email address: \r\n' + url;
// };
// text(user, url) {
//   const emailAddress = user.emails[0].address;
//   const urlWithoutHash = url.replace('#/', '');
//   const supportEmail = 'support@godunk.com';
//   const emailBody = `To verify your email address (${emailAddress}) visit the
// following link:\n\n${urlWithoutHash}\n\n If you did not request this verification,
// please ignore this email. If you feel something is wrong, please contact our support
// team: ${supportEmail}.`;
//   return emailBody;
// },
// const token = url.substring(url.lastIndexOf('/') + 1, url.length);
// const newUrl = Meteor.absoluteUrl(`resetp/${token}`);
// let str = 'Hello, \n';
// str += 'Click on the following link to reset your password \n';
// str += newUrl;
// return str;
// Accounts.emailTemplates.resetPassword.text = function(user, url) {
