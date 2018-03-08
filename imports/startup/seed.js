/*
 * If Meteor is not running in prod mode, define
 * seeds for use in the console
 */
import moment from 'moment';
import Ads from '/imports/modules/ads/collection';
import Boards from '/imports/modules/boards/collection';
import Categories from '/imports/modules/categories/collection';
import Products from '/imports/modules/products/collection';
import BoardProducts from '/imports/modules/clips/collection';
import Retailers from '/imports/modules/retailers/collection';
import Contacts from '/imports/modules/contacts/collection';
import ContactEmails from '/imports/modules/contact_emails/collection';
import UserLedgers from '/imports/modules/user_ledgers/user_ledgers';
import { Meteor } from 'meteor/meteor';
import { Fake } from 'meteor/anti:fake';

let Seed;
if (process.env.NODE_ENV !== 'production') {
  const randomDate = () => { return moment().add(-Math.random() * 365, 'days').toDate(); };
  const randomInArray = (array) => {
    return array[randomInt(array.length - 1)];
  };
  const randomInt = (max) => { return Math.round(Math.random() * (max)); };

  Factory.define('userLedger', UserLedgers, {
    type: 'Sale',
    amount() {
      return Math.floor((Math.random() - 0.5) * 10000) / 100;
    },
    description() {
      return Fake.sentence();
    },
    jobId: () => {
      return Random.id();
    },
    boardProductsId: () => {
      const bproducts = BoardProducts.find({}, { limit: 30 }).fetch();
      if (randomInt(1)) {
        return randomInArray(bproducts)._id;
      }
    },
    postDate: () => {
      return randomDate();
    },
  });

  Factory.define('user', Meteor.users, {
    profile: {
      name: () => {
        return (Math.random() > 0.5) ?
          Fake.user().name :
          'stheoauuuuussssssssssssssssssssssssssssssssssssssssssss';
      },
      created: new Date(),
      updated: new Date(),
      mxpdid() { return Random.id(); },
      leadSource: 'organic',
      images: [{ href: 'https://clipboards.s3.amazonaws.com/1466696850278image.jpeg' }],
    },
    emails: () => {
      return [{ address: Fake.user().email, verified: !!randomInt(1) }];
    },
    username: () => {
      return Fake.user().fullname.replace(/ /g, '');
    },
    phones: [],
    // roles: [ 'shopper' ],
    created: new Date(),
    updated: new Date(),
    mxpdid: () => { Random.id(); },
  });

  Factory.define('contact', Contacts, {});

  Factory.define('contactEmails', ContactEmails, {
    email() {
      return Fake.user().email;
    },
  });

  Factory.define('board', Boards, {
    title: () => {
      return Fake.sentence(randomInt(10) + 1);
    },
    creatorId: () => {
      const users = Meteor.users.find().fetch();
      return randomInArray(users)._id;
    },
    images: [{
      _id: '0',
      author: 'unknown',
      author_url: 'unknown',
      href: 'http://lorempixel.com/40/400',
    }],
    type: () => randomInt(2) - 1,
    status: () => {
      return randomInt(2) - 1;
    },
    products: [],
    caption: () => Fake.paragraph(60),
  });

  /*
   * Much of the fields in this model should go away when we properly denormalize
   */
  Factory.define('boardProduct', BoardProducts, {
    boardTitle: () => {
      return Fake.paragraph();
    },
    status: () => randomInt(2) - 1,
    type: () => randomInt(2) - 1,
    boardCreatorId: 'CqvPxTXJLBBfNmtqx',
    creatorId: () => {
      return Meteor.users.findOne()._id;
    },
    domain: 'zales.com',
    price: 200,
    title: () => {
      return Fake.sentence();
    },
    url: 'http://www.zales.com/oval-lab-created-blue-sapphire-diamond-accent-bangle-sterling-silver/product.jsp?productId=11453072',
    images: [{
      href: 'https://abs.twimg.com/sticky/default_profile_images/default_profile_5_normal.png',
    }, {
      href: 'http://lorempixel.com/400/50',
    }, {
      href: 'http://lorempixel.com/40/400',
    }, {
      href: 'http://pisces.bbystatic.com/image2/BestBuy_US/images/products/4209/4209600_sa.jpg;canvasHeight=210;canvasWidth=210',
    }],
    caption: () => Fake.paragraph(60),
    retailer: () => Fake.word(),
    description: () => Fake.paragraph(60),
    boardId: () => {
      const boards = Boards.find({}).fetch();
      return randomInArray(boards)._id;
    },
  });

  Factory.define('product', Products, {
    boards: [],
    commenters: [],
    clickCount: 0,
    creatorId: () => {
      return Meteor.users.findOne()._id;
    },
    upVotes: 0,
    upVoters: [],
    downVotes: 0,
    downVoters: [],
    score: 0,
    status: 2,
    inactive: false,
    domain: 'zales.com',
    keywords: 'Oval Lab-Created Blue Sapphire and Diamond Accent Bangle in Sterling Silver - 7.25" - ZALES View All Bracelets',
    price: 200,
    title: 'Oval Lab-Created Blue Sapphire and Diamond Accent Bangle in Sterling Silver - 7.25',
    url: 'http://www.zales.com/oval-lab-created-blue-sapphire-diamond-accent-bangle-sterling-silver/product.jsp?productId=11453072',
    userId: '43SDhtBfQ46GSioFi',
    images: [{
      _id: '0',
      author: 'unknown',
      author_url: 'unknown',
      href: 'http://pisces.bbystatic.com/image2/BestBuy_US/images/products/4209/4209600_sa.jpg;canvasHeight=210;canvasWidth=210',
    }],
    videos: [],
    comments: [],
    created: randomDate,
    updated: randomDate,
    mfg: '',
    mpn: '',
    retailer411: '',
    returnpol: '',
    title_sort: 'oval lab-created blue sapphire and diamond accent bangle in sterling silver - 7.25',
    caption: () => Fake.paragraph(10),
  });

  Seed = {
    Boards(options = {}) {
      _.times(20, () => {
        const b = Factory.create('board', options);
      });
    },

    BoardProducts(options = {}, count = 30) {
      // Ideally this should use whatever is really done in the code

      const products = Products.find().fetch();
      _.times(count, () => {
        Factory.create(
          'boardProduct',
          Object.assign(options, { productId: randomInArray(products)._id })
        );
      });
    },

    Contacts(options = {}, count = 30) {
      const users = Meteor.users.find({}, { limit: 100 });

      users.forEach((user) => {
        Meteor.users.find().forEach((contact) => {
          Factory.create(
            'contact',
            Object.assign(options, { contactId: contact._id, userId: user._id })
          );
        });
      });
    },

    ContactEmails(options = {}, count = 30) {
      Factory.create('contactEmails', options);
    },

    Products(options = {}, count = 30) {
      const products = Products.find().fetch();
      _.times(count, () => {
        Factory.create(
          'product',
          Object.assign(options, {})
        );
      });
    },

    Retailers() {
      Retailers.insert({
        retailer: 'Amazon',
        domain: 'amazon.com',
        status: 0,
        network: 'VL',
        url: 'www.amazon.com',
        networkId: '',
      });
    },

    UserLedgers(userId) {
      _.times(300, () => {
        Factory.create('userLedger', { userId });
      });
    },

    Users(options, count = 30) {
      _.times(count, () => {
        Factory.create(
          'user',
          options
        );
      });
    },

    /*
     * Some dev helpers
     */
    makeAllPrivate() {
      Boards.update({}, { $set: { type: 1 } }, { multi: true });
    },

    makeAllPublic() {
      Boards.update({}, { $set: { type: 0 } }, { multi: true });
    },

    makeAllOpen() {
      Boards.update({}, { $set: { status: 0 } }, { multi: true });
    },

    makeAllClosed() {
      Boards.update({}, { $set: { status: 1 } }, { multi: true });
    },

    addToInvited(userId) {
      Boards.update({}, { $addToSet: { invitedIds: userId } }, { multi: true });
      BoardProducts.update({}, { $addToSet: { invitedIds: userId } }, { multi: true });
    },

    addToFavorited(userId) {
      Boards.update({}, { $addToSet: { favoritedByIds: userId } }, { multi: true });
      BoardProducts.update({}, { $addToSet: { favoritedByIds: userId } }, { multi: true });
    },

    clearFavorites() {
      Boards.update({}, { $set: { favoritedByIds: [] } }, { multi: true });
      BoardProducts.update({}, { $set: { favoritedByIds: [] } }, { multi: true });
    },

    clearInvited() {
      Boards.update({}, { $set: { invitedIds: [] } }, { multi: true });
      BoardProducts.update({}, { $set: { invitedIds: [] } }, { multi: true });
    },

    verifyAllUsers() {
      Meteor.users.update({}, { $set: { verified: true } }, { multi: true });
    },
  };

  if (Ads.find().count() === 0) {
    Ads.insert({
      adUnit: 'My Boards',
      width: 320,
      height: 50,
      url: 'http://google.com',
      src: '/img/mcdonalds728x90example.jpg',
    });
    Ads.insert({
      adUnit: 'My Boards',
      width: 728,
      height: 90,
      url: 'http://google.com',
      src: '/img/mcdonalds728x90example.jpg',
    });
    Ads.insert({
      adUnit: 'Browse Boards',
      width: 320,
      height: 50,
      url: 'http://google.com',
      src: '/img/mcdonalds728x90example.jpg',
    });
    Ads.insert({
      adUnit: 'Browse Boards',
      width: 728,
      height: 90,
      url: 'http://google.com',
      src: '/img/mcdonalds728x90example.jpg',
    });
    Categories.find().forEach((c) => {
      Ads.insert({
        adUnit: c.title,
        width: 320,
        height: 50,
        url: 'http://google.com',
        src: '/img/mcdonalds728x90example.jpg',
      });
      Ads.insert({
        adUnit: c.title,
        width: 728,
        height: 90,
        url: 'http://google.com',
        src: '/img/mcdonalds728x90example.jpg',
      });
    });
  }
}

export default Seed;
