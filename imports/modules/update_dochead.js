import { Meteor } from 'meteor/meteor';
import { DocHead } from 'meteor/kadira:dochead';
var browserImageSize = require('browser-image-size');

const { facebookAppId, pinterestHeadID } = Meteor.settings.public;

const truncate = (str, len) => (
  (str && str.length > len) ?
    `${str.substring(0, len)}...` :
    str || ''
);

function removeSpecialChars(str) {
  return str.replace(/(?!\w|\s)./g, '')
    .replace(/\s+/g, '')
    .replace(/^(\s*)([\W\w]*)(\b\s*$)/g, '$2');
}

function getLocation(href) {
  var match = href.match(/^(https?\:)\/\/(([^:\/?#]*)(?:\:([0-9]+))?)([\/]{0,1}[^?#]*)(\?[^#]*|)(#.*|)$/);
  return match && {
    protocol: match[1],
    host: match[2],
    hostname: match[3],
    port: match[4],
    pathname: match[5],
    search: match[6],
    hash: match[7],
  };
}

const DEFAULT_TITLE = 'Clip. Share. Earn.';

const DEFAULT_KEYWORDS = "Consumer Electronics, Men's " +
  "Fashion, Women's Fashion, DIY, Crafts, Kids and Baby, " +
  'Home Decor, Gifts, Travel and Events, Sporting Goods, ' +
  'Extra Income, Earn Anywhere, Pinterest';

const DEFAULT_DESCRIPTION = 'Becoming a Maven allows you to help your network ' +
  'when they need it using your particular expertise and taste. And you earn money…all ' +
  'for simply inviting your friends and providing the recommendations you already know ' +
  'they will love! When they buy, you earn!';

const DEFAULT_IMAGE = Meteor.absoluteUrl('/img/maven/maven_logo.svg');

const updateHead = (opts) => {
  const {
    title,
    description,
    image,
    keywords,
    type,
    url,
    canonicalUrl,
    price,
    creatorName,
    createdAt,
    siteName,
  } = (opts || {});

  DocHead.removeDocHeadAddedTags();

  DocHead.setTitle(`Maven - ${title || DEFAULT_TITLE}`);
  DocHead.addLink({ rel: 'stylesheet', href: 'https://fonts.googleapis.com/css?family=Quicksand:400,700|Raleway:300,400,500,700' });

  DocHead.addLink({ rel: 'manifest', href: '/manifest.json' });
  DocHead.addLink({ rel: 'icon', type: 'image/png', href: '/favicon-32x32.png?v=3', sizes: '32x32' });
  DocHead.addLink({
    rel: 'icon',
    type: 'image/png',
    href: '/favicon-192x192.png?v=3',
    sizes: '192x192',
  });
  DocHead.addLink({ rel: 'apple-touch-icon-precomposed', href: '/favicon-180x180.png?v=3' });
  DocHead.addLink({ rel: 'msapplication-TileImage', href: '/favicon-270x270.png?v=3' });
  DocHead.addLink({ rel: 'mask-icon', href: '/safari-pinned-tab.svg', color: '#5bbad5' });

  DocHead.addMeta({
    name: 'viewport',
    content: 'width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no',
  });

  DocHead.addMeta({
    name: 'keywords',
    content: keywords || DEFAULT_KEYWORDS,
  });
  DocHead.addMeta({
    name: 'description',
    content: description || DEFAULT_DESCRIPTION,
  });

  DocHead.addMeta({
    property: 'p:domain_verify',
    content: pinterestHeadID,
  });

  DocHead.addMeta({
    property: 'fb:app_id',
    content: facebookAppId,
  });

  DocHead.addMeta({
    property: 'og:description',
    content: truncate(description, 300),
  });

  DocHead.addMeta({
    property: 'og:image',
    content: image || DEFAULT_IMAGE,
  });

  DocHead.addMeta({
    property: 'og:title',
    content: `Maven - ${truncate(title, 100)}`,
  });
  DocHead.addMeta({
    property: 'og:type',
    content: type || '',
  });
  DocHead.addMeta({
    property: 'og:url',
    content: url,
  });
  DocHead.addMeta({
    property: 'og:site_name',
    content: siteName || '',
  });
  if (type === 'product') {
    DocHead.addMeta({
      property: 'og:price:currency',
      content: 'USD',
    });
    DocHead.addMeta({
      property: 'og:price:amount',
      content: price || '0.00',
    });
    DocHead.addMeta({
      property: 'og:availability',
      content: 'instock',
    });
  }

  if (type === 'article') {
    DocHead.addMeta({
      property: 'article:published_time',
      content: createdAt,
    });
    DocHead.addMeta({
      property: 'article:author',
      content: truncate(creatorName, 100),
    });
  }

  DocHead.addMeta({
    name: 'twitter:image',
    content: image ? `http://res.cloudinary.com/mavenx/image/fetch/c_lpad,w_506,h_254/${image}` : DEFAULT_IMAGE,
  });

  DocHead.addMeta({
    name: 'twitter:card',
    content: 'summary_large_image',
  });
  DocHead.addMeta({
    name: 'twitter:description',
    content: truncate(description, 300),
  });
  DocHead.addMeta({
    name: 'twitter:text:description',
    content: truncate(description, 300),
  });
  DocHead.addMeta({
    name: 'twitter:site',
    content: '@mavenxinc',
  });
  DocHead.addMeta({
    name: 'twitter:title',
    content: truncate(title, 100),
  });
  DocHead.addMeta({
    name: 'twitter:text:title',
    content: truncate(title, 100),
  });
  DocHead.addMeta({
    name: 'twitter:url',
    content: url || '',
  });

  DocHead.addLink({
    rel: 'canonical',
    href: canonicalUrl || url || '',
  });
};

updateHead();

export default updateHead;
