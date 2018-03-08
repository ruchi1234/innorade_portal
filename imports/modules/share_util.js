import { Meteor } from 'meteor/meteor';
// import facebook from 'promise-facebook';

const Share = {
  facebook({ url, appId, title }) {
    const retTitle = `${title || ''} @mavenx`;
    return 'https://www.facebook.com/dialog/feed?'
     + 'app_id=' + encodeURIComponent(appId)
     + '&display=popup&caption=' + encodeURIComponent(retTitle)
     + '&link=' + encodeURIComponent(url);
  },

  pinterest({ url, title, imageUrl }) {
    return 'https://pinterest.com/pin/create/button/?url='
      + encodeURIComponent(url) + '&media='
      + encodeURIComponent(imageUrl || '') + '&description='
      + encodeURIComponent(title || '');
  },

  twitter({ url, message }) {
    const msg = `${message || ''} @mavenxinc ${url}`;
    return `https://twitter.com/intent/tweet?text=${encodeURIComponent(msg)}`;
  },
};

export default Share;
