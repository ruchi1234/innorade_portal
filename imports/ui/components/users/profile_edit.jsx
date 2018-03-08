/* global utu */
import { Meteor } from 'meteor/meteor';
import React, { PropTypes } from 'react';
import ImageModal from '/imports/ui/components/image/image_modal';
import mixpanel from 'mixpanel-browser';
import Col from '/imports/ui/components/grid/col';
import $ from 'jquery';
import FbConnect from '../../profile/edit/fbConnect';
import TwConnect from '../../profile/edit/twConnect';
import PinConnect from '../../profile/edit/pinConnect';
import InstaConnect from '../../profile/edit/instaConnect';
import { StyleSheet, css } from 'aphrodite';
import { iron, space } from '../../style';
import { FlowRouter } from 'meteor/kadira:flow-router';

const style = StyleSheet.create({
  panel: {
    marginTop: '20px',
    marginBottom: '20px',
    border: `1px solid ${iron}`,
    borderRadius: '5px',
  },
  body: {
    padding: '12px',
  },
  label: {
    fontWeight: '600',
    fontSize: '16px',
    color: space,
    marginTop: '20px',
    paddingBottom: 0,
  },
  labelOptional: {
    fontSize: '14px',
    color: iron,
  },
});

const Panel = ({ children }) => (
  <div className={css(style.panel)}>
    <div className={css(style.body)}>
      {children}
    </div>
  </div>
);

Panel.propTypes = {
  label: PropTypes.string,
  children: PropTypes.node,
};

const Label = ({ subtitle, children }) => (
  <div className={css(style.label)}>
    <p>{children}</p>
    {subtitle && <p className={css(style.labelOptional)}>{subtitle}</p>}
  </div>
);
Label.propTypes = { children: PropTypes.string.isRequired, optional: PropTypes.bool };

function removeSpecialChars(str) {
  return str.replace(/(?!\w|\s)./g, '')
    .replace(/\s+/g, '')
    .replace(/^(\s*)([\W\w]*)(\b\s*$)/g, '$2');
};

const ProfileEdit = React.createClass({
  propTypes: {
    user: React.PropTypes.object,
    boardId: React.PropTypes.string,
    onSave: React.PropTypes.func,
  },

  getInitialState() {
    return {
      dirty: false,
      switch: this.props.user.notificationFlag,
    };
  },

  onChange() {
    this.setState({
      dirty: true,
    });
  },

  onVerify() {
    Meteor.call('sendVerificationLink', (e) => {
      if (!e) {
        Bert.alert(
          'A new verification has been sent to your email!',
          'info',
          'fixed-top'
        );
      }
    });
  },

  /**
   * [onSave()]
   *  Save
   * @return {[type]} [description]
   */
  onSave() {
    let _save = true;
    const {
      user: {
        emails
      },
      user,
    } = this.props;
    const {
      confirmpassword,
      currentpassword,
      email: refemail,
      firstName,
      lastName,
      password,
      username,
      slug,
    } = this.refs;

    const oe = emails && emails[0] && emails[0].address;

    if(!firstName.value || !lastName.value) {
      Bert.alert(
        'Please confirm your first/last name!',
        'danger',
        'fixed-top',
        'fa-frown-o'
      );
      $('#firstName').addClass('form-control-error');
      _save = false;
      return;
    } else {
      $('#firstName').removeClass('form-control-error');
    }
    if(!username.value) {
      Bert.alert(
        'Display Name may not be blank.',
        'danger',
        'fixed-top',
        'fa-frown-o'
      );
      $('#username').addClass('form-control-error');
      _save = false;
      return;
    } else {
      $('#username').removeClass('form-control-error');
    }

    if (typeof this.props.user.services.password == "object") {
      console.log('checking if password account');
      if (confirmpassword.value || (oe !== refemail.value)) {
        if (!currentpassword.value) {
          Bert.alert(
            'Please confirm your current password!',
            'danger',
            'fixed-top',
            'fa-frown-o'
          );
          $('#currentpassword').addClass('form-control-error');
          _save = false;
          return;
        } else {
          $('#currentpassword').removeClass('form-control-error');
        }
      }
    }

    if (typeof this.props.user.services.password == "object") {
      console.log('checking if password account: ');
      if (password.value && !confirmpassword.value) {
        Bert.alert(
          'Please confirm your password!',
          'danger',
          'fixed-top',
          'fa-frown-o'
        );
        if (!refemail.value) {
          $('#confirmpassword').addClass('form-control-error');
        }
        _save = false;
        return;
      } else {
        $('#confirmpassword').removeClass('form-control-error');
      }
      console.log(_save);
      if ((!password.value && !confirmpassword.value) || (password.value === confirmpassword.value)) {
        $('#confirmpassword').removeClass('form-control-error');
      } else {
        Bert.alert(
          'Your new password does not match!',
          'danger',
          'fixed-top',
          'fa-frown-o'
        );
        $('#confirmpassword').addClass('form-control-error');
        _save = false;
        return;
      }
    }

    if (!refemail.value || !username.value) {
      Bert.alert(
        'Please double check your email and username - those are required!',
        'danger',
        'fixed-top',
        'fa-frown-o'
      );
      if (!refemail.value) {
        $('#email').addClass('form-control-error');
      }
      if (!username.value) {
        $('#username').addClass('form-control-error');
      }
      _save = false;
      return;
    }

    const s = removeSpecialChars(username.value);
    Meteor.call('uniqueUserName', Meteor.userId(), username.value, s, (e, r) => {
      if (!r) {
        Bert.alert('Sorry, but that display name is already registered!',
          'danger', 'fixed-top', 'fa-frown-o');
        $('#username').addClass('form-control-error');
        $('#save').addClass('signin-button-disable');
      } else {
        if (_save) {
          Bert.alert(
            !password.value && 'Your profile updates were saved.  You may notice a delay as updates are made to all of your boards.' || 'Your password was updated, and your profile changes were made. You may notice a delay as updates are made to all of your boards.',
            'success',
            'fixed-top',
            'fa-smile-o'
          );
          this.Save();
          $('#currentpassword').val('');
          $('#password').val('');
          $('#confirmpassword').val('');
          FlowRouter.go('profile', { slug: Meteor.user().slug });
        }
      }
    });
  },

  onCancel() {
    // if (confirm('Do you want to CANCEL changes?')) {
    Bert.alert('Cancelled update of profile!','warning', 'fixed-top');
    const oe = this.props.user && this.props.user.emails[0]
      && this.props.user.emails[0].address;

    this.refs.bio.value = this.props.user.profile.bio;
    this.refs.email.value = oe;
    this.refs.firstName.value = this.props.user.profile.firstName;
    this.refs.lastName.value = this.props.user.profile.lastName;
    this.refs.currentpassword.value = '';
    this.refs.password.value = '';
    this.refs.confirmpassword.value = '';
    this.refs.username.value = this.props.user.username;
    this.refs.notificationFlag.checked = this.props.user.notificationFlag;

    this.setState({
      dirty: false,
    });
    FlowRouter.go('profile', { slug: Meteor.user().slug });
  },

  onAddImage() {
    this.refs.sortImagesModal.show();
  },

  changeSwitch() {
    this.setState({
      switch: this.refs.notificationFlag.checked && true || false,
    });
  },

  validateConfirmPass() {
    if (this.refs.password.value !== this.refs.confirmpassword.value) {
      Bert.alert(
        'Your entered passwords do not match!',
        'danger',
        'fixed-top',
        'fa-frown-o'
      );
      $('#confirmpassword').addClass('form-control-error');
      $('#save').addClass('signin-button-disable');
    } else {
      $('#confirmpassword').removeClass('form-control-error');
      $('#save').removeClass('register-button-disable');
    }
  },

  validateEmail() {
    const regex = /^(([^<>()\[\]\\.,;:\s@']+(\.[^<>()\[\]\\.,;:\s@']+)*)|('.+'))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    if (!regex.test(this.refs.email.value)) {
      Bert.alert('Please double check your email, we only accept valid emails in these parts!',
        'danger', 'fixed-top', 'fa-frown-o'
      );
      $('#email').addClass('form-control-error');
      $('#save').addClass('signin-button-disable');
      return;
    } else {
      $('#email').removeClass('form-control-error');
      $('#save').removeClass('register-button-disable');
    }

    const oe = this.props.user.emails && this.props.user.emails[0]
      && this.props.user.emails[0].address;

    if (oe !== this.refs.email.value) {
      Meteor.call('uniqueEmail', this.refs.email.value, (e, r) => {
        // console.log(r);
        if (!r) {
          Bert.alert(
            'Sorry, but that email is already registered!',
            'danger',
            'fixed-top',
            'fa-frown-o'
          );
          $('#email').addClass('form-control-error');
          $('#save').addClass('signin-button-disable');
        } else {
          Bert.alert(
            'After updating your email you will have to revalidate!',
            'warning',
            'fixed-top'
          );
          $('#email').removeClass('form-control-error');
          $('#save').removeClass('signin-button-disable');
        }
      });
    } else {
      $('#email').removeClass('form-control-error');
      $('#save').removeClass('signin-button-disable');
    }
  },

  validatePassword() {
    // console.log(this.refs.password.value);
    const regex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,20}$/;
    if (!regex.test(this.refs.password.value) && this.refs.password.value !== '') {
      Bert.alert(
        `Password must be between 6 to 20 characters, contain at least one numeric
        digit, one uppercase and one lowercase letter`,
        'danger',
        'fixed-top',
        'fa-frown-o'
      );
      $('#password').addClass('form-control-error');
      $('#save').addClass('signin-button-disable');
    } else {
      $('#password').removeClass('form-control-error');
      $('#save').removeClass('register-button-disable');
    }
  },

  validateUserName() {
    // const regex = /^[a-zA-Z0-9_-]{5,25}$/;
    // const regex = /^{5,50}$/;
    // if (this.refs.username.value && regex.test(this.refs.username.value)) {
    if (this.refs.username.value) {
      if (this.props.user.username !== this.refs.username.value) {
        const slug = removeSpecialChars(this.refs.username.value);
        Meteor.call('uniqueUserName', Meteor.userId(), this.refs.username.value, slug, (e, r) => {
          if (!r) {
            Bert.alert('Sorry, but that display name is already registered!',
              'danger', 'fixed-top', 'fa-frown-o');
            $('#username').addClass('form-control-error');
            $('#save').addClass('signin-button-disable');
          } else {
            this.refs.slug.value = 'https://www.mavenx.com/profile/' + slug;
            $('#username').removeClass('form-control-error');
            $('#save').removeClass('signin-button-disable');
          }
        });
      } else {
        this.refs.slug.value = 'https://www.mavenx.com/profile/' + slug;
        $('#username').removeClass('form-control-error');
        $('#save').removeClass('signin-button-disable');
      }
    } else {
      Bert.alert('Sorry, display names must be between 5 and 50 characters',
        'danger', 'fixed-top', 'fa-frown-o');
      $('#username').addClass('form-control-error');
      $('#save').addClass('signin-button-disable');
    }
  },

  Save() {
    const oe = this.props.user.emails && this.props.user.emails[0]
      && this.props.user.emails[0].address;
    const user = {};

    if (this.props.user.bio !== this.refs.bio.value) {
      user.bio = this.refs.bio.value;
    }
    if (oe !== this.refs.email.value) {
      user.email = this.refs.email.value;
    }
    if (this.props.user.firstName !== this.refs.firstName.value) {
      user.firstName = this.refs.firstName.value;
    }
    if (this.props.user.lastName !== this.refs.lastName.value) {
      user.lastName = this.refs.lastName.value;
    }
    if (this.props.user.notificationFlag !== this.refs.notificationFlag.checked) {
      user.notificationFlag = this.refs.notificationFlag.checked;
    }
    if ((this.props.user.password !== this.refs.password.value) && this.refs.password.value) {
      user.password = this.refs.password.value;
    }
    if ((this.props.user.currentpassword !== this.refs.currentpassword.value) && this.refs.currentpassword.value) {
      user.currentpassword = this.refs.currentpassword.value;
    }
    if (this.props.user.username !== this.refs.username.value) {
      user.username = this.refs.username.value;
      user.slug = removeSpecialChars(this.refs.username.value);
    }

    const re = new RegExp('^(http|https)://', 'i');
    user.retailerUrl = this.refs.retailerUrl.value.replace(re, '');
    user.blogUrl = this.refs.blogUrl.value.replace(re, '');

    this.props.onSave(user);

    this.setState({
      dirty: false,
    });
  },

  userImagesOrderModalClose() {
    mixpanel.track('User - Ordered Images', {
      usid: Meteor.userId(),
    });
    utu.track('User - Ordered Images', {
      usid: Meteor.userId(),
    });
  },

  handleAddImage(image) {
    Meteor.users.api.addImage.call({
      _id: Meteor.userId(),
      image,
    });
  },

  updateImages(params) {
    const data = {
      images: params.images,
    };
    Meteor.call('updateUserAccount', data, () => {
      mixpanel.track('User - Added Images', {
        usid: Meteor.userId(),
      });
      utu.track('User - Added Images', {
        usid: Meteor.userId(),
      });
    });
  },

  renderEmailVerified() {
    if (this.props.user && this.props.user.emails && this.props.user.emails[0]
      && this.props.user.emails[0].verified) {
        // don't show warning
    } else {
      return (
        <div
          className="align-center alert alert-warning">
          Your email address is not verified. Re-send the verification link to
          your email address below &nbsp;
          <span
            className="glyphicon glyphicon-warning-sign">
          </span>
        </div>
      );
    }
  },

  renderFooter() {
    if (!this.state.dirty) {
      return (
        <div className="row">
          <div className="col-xs-6">
            <button
              id="cancel"
              type="button"
              className="btn-custom"
              onClick={this.onCancel}
            >
              Cancel
            </button>
          </div>
          <div className="col-xs-6">
            <button
              id="save"
              className="btn btn-default btn-block btn-custom disabled"
              onClick={this.onSave}
            >
              Save
            </button>
          </div>
        </div>
      );
    } else {
      return (
        <div className="row">
          <div className="col-xs-6">
            <button
              id="cancel"
              type="button"
              className="btn-custom"
              onClick={this.onCancel}
            >
              Cancel
            </button>
          </div>
          <div className="col-xs-6">
            <button
              id="save"
              className="btn-custom"
              onClick={this.onSave}
            >
              Save
            </button>
          </div>
        </div>
      );
    }
  },

  render() {
    const { user } = this.props;

    let notify = 'checked';
    let notNotify = '';
    if (!this.props.user.notificationFlag) {
      notify = '';
      notNotify = 'checked';
    }

    const singleImgStyle = {
      backgroundImage: `url('${user.getImage()}')`
    }
    return (
      <div id="profileForm">
        {
          this.renderEmailVerified()
        }
        <div
            className="row">
          <Col
              xs={12} md={4} lg={4} className="profile-header">
            <div
                className="row">
              <Col
                xs={12}
                md={6}
                lg={6}>
                <div
                  className="single-image-container"
                  style={singleImgStyle}>
                </div>
              </Col>
            </div>
            <div
                className="row">
              <Col
                xs={12}
                md={6}
                lg={6}>
                <div
                  className="btn btn-default btn-block btn-custom"
                  onClick={this.onAddImage}>
                  Manage Images
                </div>
              </Col>
            </div>
          </Col>
          <Col xs={12} md={8} lg={8}>
            <div
              className="row formRow">
              <div
                className="col-sm-4">
                <Label>Name:</Label>
              </div>
              <div
                className="col-md-4 col-sm-8">
                <input
                  id="firstName"
                  ref="firstName"
                  type="text"
                  onChange={this.onChange}
                  defaultValue={this.props.user.profile.firstName}
                  placeholder="First name ..." />
              </div>
              <div
                className="col-md-4 col-md-offset-0 col-sm-offset-4 col-sm-8">
                <input
                  id="lastName"
                  ref="lastName"
                  type="text"
                  onChange={this.onChange}
                  defaultValue={this.props.user.profile.lastName}
                  placeholder="Last name ..." />
              </div>
              <div
                className="col-xs-12">
                <div
                  className="formSeparator">
                </div>
              </div>
            </div>
            <div
              className="row formRow">
              <div
                className="col-sm-4">
                <Label>Display Name:</Label>
              </div>
              <div
                className="col-sm-8">
                <input
                  id="username"
                  ref="username"
                  type="text"
                  onChange={this.onChange}
                  defaultValue={this.props.user.username}
                  onBlur={this.validateUserName}
                  placeholder="This is what will be displayed in Maven ..." />
              </div>
              <div
                className="col-xs-12">
                <div
                  className="formSeparator">
                </div>
              </div>
            </div>
            <div
              className="row formRow">
              <div
                className="col-sm-4">
                <Label>Vanity URL:</Label>
              </div>
              <div
                className="col-sm-8">
                <input
                  id="slug"
                  ref="slug"
                  type="text"
                  disabled
                  defaultValue={FlowRouter.url('profile', { slug: this.props.user.slug })}
                  placeholder="This will be your personal, shareable URL ..." />
              </div>
              <div
                className="col-xs-12">
                <div
                  className="formSeparator">
                </div>
              </div>
            </div>
            <div
              className="row formRow">
              <div className="col-sm-4">
                <Label>Email:</Label>
              </div>
              <div
                className={`col-sm-8 ${user && user.emails && user.emails[0] && !user.emails[0].verified && 'col-lg-5'}`}>
                <input
                  id="email"
                  ref="email"
                  type="email"
                  onChange={this.onChange}
                  onBlur={this.validateEmail}
                  defaultValue={
                    this.props.user.emails && this.props.user.emails[0] && this.props.user.emails[0].address
                  }
                  placeholder="Enter your preferred email here ..." />
              </div>
              {
                this.props.user && this.props.user.emails && this.props.user.emails[0]
                && !this.props.user.emails[0].verified
                ? <div
                    className="col-lg-3 col-md-8 col-lg-offset-0 col-sm-offset-4 col-sm-8">
                    <button
                      className="btn-custom verification-btn"
                      onClick={this.onVerify}>
                      Send Verification Link
                    </button>
                  </div>
                  : ''
               }
               <div
                 className="col-xs-12">
                 <div
                   className="formSeparator">
                 </div>
               </div>
            </div>
            <div
              className="row formRow">
              <div
                className="col-sm-4">
                <Label>
                  Update Password:
                </Label>
              </div>
              <div
                className="col-md-4 col-sm-8">
                <input
                  id="currentpassword"
                  placeholder="Current Password"
                  ref="currentpassword"
                  type="password"
                  onBlur={this.validateCurrentPass}/>
              </div>
              <div
                className="col-sm-4">
              </div>
              <div
                className="col-sm-offset-4 col-md-4 col-sm-8">
                <input
                  id="password"
                  ref="password"
                  type="password"
                  onChange={this.onChange}
                  onBlur={this.validatePassword}
                  placeholder="New Password"/>
              </div>
              <div
                className="col-md-4 col-md-offset-0 col-sm-offset-4 col-sm-8">
                <input
                  id="confirmpassword"
                  ref="confirmpassword"
                  type="password"
                  onChange={this.onChange}
                  onBlur={this.validateConfirmPass} placeholder="Confirm Password"/>
              </div>
              <div
                className="col-xs-12">
                <div
                  className="formSeparator">
                </div>
              </div>
            </div>
            <div
              className="row formRow">
              <div className="col-sm-4">
                <Label>Summary:</Label>
              </div>
              <div
                className="col-sm-8">
                <textarea
                  id="bio"
                  ref="bio"
                  rows="10"
                  type="text"
                  onChange={this.onChange}
                  defaultValue={this.props.user.profile.bio}
                  placeholder="Provide a bit of background that you think would be interesting to other users ..."/>
              </div>
              <div
                className="col-xs-12">
                <div
                  className="formSeparator">
                </div>
              </div>
            </div>
            <div
              className="row formRow">
              <div className="col-sm-4">
                <Label>Notifications</Label>
              </div>
              <div
                className="col-sm-8">
                <div
                  className="row switchRow">
                  <p>Turn on email notification?</p>
                  <label className="switch">
                    <input
                      ref="notificationFlag"
                      type="checkbox"
                      name="privateBoard"
                      defaultChecked={notify}
                      onChange={this.onChange}
                      onClick={this.changeSwitch}>
                    </input>
                    <div className="slider-check">
                      {
                        this.state.switch && <span className="left">yes</span> || <span className="right">no</span>
                      }
                    </div>
                  </label>
                </div>
              </div>
              <div className="col-xs-12" >
                <div className="formSeparator" >
                </div>
              </div>
            </div>
            <div className="row formRow">
              <div className="col-sm-4">
                <Label subtitle="(optional)">
                  Your Social Accounts:
                </Label>
              </div>
              <div className="col-sm-8">
                <Panel>
                  <FbConnect user={user} />
                  <TwConnect user={user} />
                  <PinConnect user={user} />
                  <InstaConnect user={user} />
                </Panel>
              </div>
              <div className="col-xs-12">
                <div className="formSeparator">
                </div>
              </div>
            </div>
            <div className="row formRow">
              <div className="col-sm-4">
                <Label subtitle="(optional, to display link to your blog)">
                  Your Blog URL:
                </Label>
              </div>
              <div className="col-sm-8">
                <input
                  ref="blogUrl"
                  defaultValue={_.get(user, 'profile.blogUrl')}
                  onChange={this.onChange}
                />
              </div>
            </div>
            <div className="row formRow">
              <div className="col-sm-4">
                <Label subtitle="(optional, to display link to your store)">
                  Your Retail Store URL:
                </Label>
              </div>
              <div className="col-sm-8">
                <input
                  ref="retailerUrl"
                  defaultValue={_.get(user, 'profile.retailerUrl')}
                  onChange={this.onChange}
                />
              </div>
            </div>
          {
            this.renderFooter()
          }
        </Col>
        </div>
        {
          this.props.user &&
            <ImageModal
              _id={this.props.user._id}
              doc={this.props.user}
              images={this.props.user.profile.images || []}
              onUpdateImages={this.updateImages}
              handleAddImage={this.handleAddImage}
              ref="sortImagesModal"
            />
        }
      </div>
    );
  },
});

export default ProfileEdit;
