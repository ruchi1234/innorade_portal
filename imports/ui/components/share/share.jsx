/* global utu */
import { Meteor } from 'meteor/meteor';
import React from 'react';
import mixpanel from 'mixpanel-browser';
import ShareUtil from '/imports/modules/share_util';
import ClipboardBtn from '/imports/ui/components/clipboard/btn';

import Popover from '/imports/ui/components/popover';
import PinterestIcon from '/imports/ui/components/social/pinterest_icon';
import FacebookIcon from '/imports/ui/components/social/facebook_icon';
import TwitterIcon from '/imports/ui/components/social/twitter_icon';
import EmailIcon from '/imports/ui/components/social/email_icon';
import CopyAurlIcon from '/imports/ui/components/social/copy_aurl_icon';
import CopyEmbedCodeIcon from '/imports/ui/components/social/copy_embed_code';

const { facebookAppId } = Meteor.settings.public;

const windowOpenerHOF = (url, service) =>
  (e) => {
    mixpanel.track('Social Share', {
      service,
      url,
      userId: Meteor.userId(),
    });
    utu.track('Social Share', {
      service,
      url,
      userId: Meteor.userId(),
    });

    e.preventDefault();
    const height = 300;
    const width = 500;
    const left = (screen.width / 2) - (width / 2);
    const top = (screen.height / 2) - (height / 2);
    const params = `menubar=no,toolbar=no,resizable=yes,scrollbars=yes,width=${width},` +
      `height=${height},top=${top},left="${left}`;

    window.open(url, '', params);
  };

const launchFBDialog = (data) => {
  // https://developers.facebook.com/docs/sharing/reference/share-dialog
  // https://developers.facebook.com/docs/javascript/quickstart
  mixpanel.track('Social Share', {
    service: 'facebook',
    url: data.url,
    userId: Meteor.userId(),
  });
  utu.track('Social Share', {
    service: 'facebook',
    url: data.url,
    userId: Meteor.userId(),
  });
  FB.init({
    appId: facebookAppId,
    status: true,
    xfbml: true,
  });
  FB.ui({
    method: 'share',
    href: data.url,
    quote: data.quote,
  });
};

const Body = React.createClass({
  propTypes: {
    url: React.PropTypes.string.isRequired,
    title: React.PropTypes.string,
    caption: React.PropTypes.string,
    inviteOnly: React.PropTypes.bool,
    imageUrl: React.PropTypes.string,
    handleShareByEmail: React.PropTypes.func,
    affiliateUrl: React.PropTypes.string,
    showEmbed: React.PropTypes.bool,
    embed: React.PropTypes.string,
    type: React.PropTypes.string,
  },

  onAurlCopy() {
    const { url, affiliateUrl, type } = this.props;
    Bert.alert('Link copied to clipboard!', 'success', 'fixed-top', 'fa-info');
    mixpanel.track('Copy Link', {
      url: affiliateUrl || url,
      userId: Meteor.userId(),
      type,
    });
    utu.track('Copy Link', {
      url: affiliateUrl || url,
      userId: Meteor.userId(),
      type,
    });
  },

  onEmbedCopy() {
    const { url, type } = this.props;
    Bert.alert('Embed copied to clipboard!', 'success', 'fixed-top', 'fa-info');
    mixpanel.track('Copy Embed', {
      url,
      userId: Meteor.userId(),
      type,
    });
    utu.track('Copy Embed', {
      url,
      userId: Meteor.userId(),
      type,
    });
  },

// ***************
// Where the F does this code run?  Or anywhere?
// ***************

  render() {
    const { url, imageUrl, affiliateUrl, handleShareByEmail, title,
      preferPlace, caption, inviteOnly, showEmbed, embed } = this.props;

    const mixPinLabel = encodeURIComponent('AURL - Pinterest Redirect');
    const mixLinkLabel = encodeURIComponent('AURL - Link Redirect');
    const ret = encodeURIComponent(this.props.clip.retailer);
    let pLink;
    let rLink;

    console.log('lib Share.jsx: ', this.props);
    if (!!affiliateUrl) {
      pLink = `${affiliateUrl}&retailer=${ret}&mixpanelLabel=${mixPinLabel}`;
      rLink = `${affiliateUrl}&retailer=${ret}&mixpanelLabel=${mixLinkLabel}`;
    }
    console.log('ret: ', ret);
    console.log('lib pLink: ', pLink);
    console.log('lib rLink: ', rLink);

    const twitterMsg = (title || '').length > 78 ? `${title.substring(0, 78)}...` : title;
    const pinterestTitle = caption ? `${title} - ${caption}` : title;

    return (
      <ul className="nav nav-pills nav-stacked share-popover">
        {!inviteOnly &&
          <li>
            <a
              onClick={() => launchFBDialog({
                url,
                quote: pinterestTitle })}
            >
              <FacebookIcon />
              <div>Facebook</div>
            </a>
          </li>
        }
        {!inviteOnly &&
          <li>
            <a
              onClick={
                windowOpenerHOF(
                  ShareUtil.pinterest({
                    url: (pLink || url),
                    imageUrl,
                    title: pinterestTitle }),
                  'pinterest'
                )
              }
            >
              <PinterestIcon />
              <div>Pinterest</div>
            </a>
          </li>
        }
        {!inviteOnly &&
          <li>
            <a
              onClick={
                windowOpenerHOF(
                  ShareUtil.twitter({ url, imageUrl, message: twitterMsg }),
                  'twitter'
                )
              }
            >
              <TwitterIcon />
              <div>Twitter</div>
            </a>
          </li>
        }
        <li>
          <a onClick={handleShareByEmail}>
            <EmailIcon />
            <div>Email</div>
          </a>
        </li>
        {!inviteOnly && showEmbed &&
          <li>
            <ClipboardBtn clipboardContent={rLink || url} onSuccess={this.onAurlCopy} type="AURL">
              <CopyAurlIcon />
              <div>Copy Link</div>
            </ClipboardBtn>
          </li>
        }
        {!inviteOnly && showEmbed &&
          <li>
            <ClipboardBtn clipboardContent={embed} onSuccess={this.onEmbedCopy} type="Embed">
              <CopyEmbedCodeIcon />
              <div>Copy Embed</div>
            </ClipboardBtn>
          </li>
        }
      </ul>
    );
  },
});

// Body.propTypes = {
//   url: React.PropTypes.string.isRequired,
//   title: React.PropTypes.string.isRequired,
//   caption: React.PropTypes.string,
//   imageUrl: React.PropTypes.string.isRequired,
//   handleShareByEmail: React.PropTypes.func.isRequired,
//
//   affiliateUrl: React.PropTypes.string,
// };

class Share extends React.Component {
  handleShareByEmail(e) {
    e.preventDefault();
    this.props.handleShareByEmail();
  }

  show(e) {
    e.preventDefault();
    this.refs.sharePopover.show();
  }

  render() {
    const { preferPlace } = this.props;
    const body = (
      <Body
        handleShareByEmail={this.handleShareByEmail}
        {...this.props}
      />
    );
    console.log('Share component');
    return (
      <Popover
        ref="sharePopover"
        preferPlace={preferPlace}
        body={body}
      />
    );
  }
}

Share.propTypes = {
  url: React.PropTypes.string.isRequired,
  title: React.PropTypes.string,
  caption: React.PropTypes.string,
  imageUrl: React.PropTypes.string,
  handleShareByEmail: React.PropTypes.func.isRequired,
  affiliateUrl: React.PropTypes.string,
  affiliateLinkUrl: React.PropTypes.string,
  affiliatePinUrl: React.PropTypes.string,
};

export default Share;

export { Body, windowOpenerHOF };
