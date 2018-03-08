import { Meteor } from 'meteor/meteor';
import { extractDomain } from '/imports/modules/domain_utils';
import Retailers from '/imports/modules/retailers/collection';
import { check } from 'meteor/check';
import { _ } from 'meteor/underscore';
import { iframelyAPI } from '/imports/lib/server/scrape/iframely';
import { embedlyAPI } from '/imports/lib/server/scrape/embedly';
import { indixStoreLookUp, indixProductLookup } from '/imports/lib/server/scrape/indix';

Meteor.methods({

  /**
  * scrape price from Indix.
  * @param {String} url
  * @returns {Object} _product
  */
  // scrapePrice(url) {
  //   console.log('scrapePrice...');
  //
  //   check(Meteor.userId(), String);
  //   check(url, String);
  //
  //   const _product = {};
  //
  //   _product.userId = Meteor.userId();
  //
  //   // remove any secondary+ parameters on the url
  //   _product.url = url.indexOf('&') > 0 ? (url.split('&', 1)).toString() : url;
  //
  //   // isolate the domain from the url
  //   _product.domain = extractDomain(_product.url);
  //
  //   // this lookup is all about getting the indix storeId
  //   const _retailer = Retailers.findOne({ domain: _product.domain.toLowerCase() });
  //   console.log('retailer', _retailer, _product);
  //   if (_retailer) {
  //     _product.network = _retailer.network || '';
  //     _product.retailer = _retailer.retailer;
  //     _product.returnpol = _retailer.returnpol || '';
  //     _product.retailer411 = _retailer.retailer411 || '';
  //     _product.indix_storeId = _retailer.indix_storeId || '';
  //   }
  //
  //   // if it's a new indix storeId append to the retailer record
  //   // if (!_retailer || !_retailer.indix_storeId) {
  //   //   const storeLookup = indixStoreLookUp(extractDomain(_product.url));
  //   //   if (storeLookup) {
  //   //     _product.indix_storeId = storeLookup;
  //   //     const _ret = {
  //   //       indix_storeId: storeLookup.toString(),
  //   //       domain: _product.domain,
  //   //     };
  //   //     Meteor.call('retailerUpsert', _ret);
  //   //   }
  //   // }
  //
  //   // const _lookup = indixProductLookup(_product.url);
  //   // if (_lookup && _lookup.count > 0) {
  //   //   _.each(_lookup.products, (product) => {
  //   //     _.each(product.stores, (store) => {
  //   //       if (store.storeId === _product.indix_storeId) {
  //   //         console.log('found store match: ', store);
  //   //         _product.indix_retailer = store.storeName;
  //   //         _product.price = store.offers[0].salePrice;
  //   //         _product.indix_salePrice = store.offers[0].salePrice;
  //   //         _product.indix_mpid = product.mpid;
  //   //         _product.indix_categoryName = product.categoryName;
  //   //         _product.indix_upcs = product.upcs;
  //   //         _product.indix_brandName = product.brandName;
  //   //         _product.indix_minSalePrice = product.minSalePrice;
  //   //         _product.indix_maxSalePrice = product.maxSalePrice;
  //   //       }
  //   //     });
  //   //   });
  //   // }
  //
  //   console.log('\n\nproduct: ', _product, '\n\n');
  //   return (_product);
  // },


  // /**
  // * scrape title & description
  // * @param {String} url
  // * @returns {string} _id (uniuqe)
  // */
  // scrapeTitleDescription(url) {
  //   console.log('\n \n \n');
  //   console.log('scrapeTitleDescription...');
  //   check(url, String);
  //
  //   const _product = {};
  //   _product.userId = Meteor.userId();
  //
  //   // remove any secondary+ parameters on the url
  //   _product.url = url.indexOf('&') > 0 ? (url.split('&', 1)).toString() : url;
  //
  //   // try to scrap what we can w/ iframely
  //   let _lookup = iframelyAPI(_product.url);
  //
  //   if (_lookup) {
  //     _product.title = _lookup.meta.title || '';
  //     _product.description = _lookup.meta.description || '';
  //   }
  //
  //   _lookup = embedlyAPI(_product.url);
  //
  //   if (_lookup) {
  //     if (_lookup.data && _lookup.data.title && _lookup.data.title.length > _product.title) {
  //       _product.title = _lookup.data.title;
  //     }
  //
  //     if (_lookup.data && _lookup.data.description &&
  //       _lookup.data.description.length > _product.body) {
  //       _product.description = _lookup.data.description;
  //     }
  //   }
  //
  //   console.log(_product, '\n\n\n');
  //   return (_product);
  // },


  /**
  * scrape title & description
  * @param {String} url
  * @returns {string} _id (uniuqe)
  */
  scrapeTitleDescription(url) {
    console.log('\n \n \n');
    console.log('scrapeTitleDescription...');

    // check(Meteor.userId(), String);
    check(url, String);

    const cusr = Meteor.user();
    const _product = {};

    _product.userId = Meteor.userId();

    // remove any secondary+ parameters on the url
    _product.url = url.indexOf('&') > 0 ? (url.split('&', 1)).toString() : url;

    // isolate the domain from the url
    // _product.domain = extractDomain(_product.url);
    _product.domain = extractDomain(url);

    // this lookup is all about getting the indix storeId
    const _retailer = Retailers.findOne({ domain: _product.domain.toLowerCase() });
    // console.log('retailer', _retailer, _product);
    if (_retailer) {
      _product.aurlType = _retailer.aurlType || '';
      _product.network = _retailer.network || '';
      _product.retailer = _retailer.retailer;
      _product.returnpol = _retailer.returnpol || '';
      _product.retailer411 = _retailer.retailer411 || '';
      // _product.indix_storeId = _retailer.indix_storeId || '';
    } else {
      _product.retailer = _product.domain.toLowerCase();
      _product.aurlType = 0;
      _product.network = '';
      _product.returnpol = '';
      _product.retailer411 = '';
    }

    // if it's a new indix storeId append to the retailer record
    // if (!_retailer || !_retailer.indix_storeId) {
    //   const storeLookup = indixStoreLookUp(extractDomain(_product.url));
    //   if (storeLookup) {
    //     _product.indix_storeId = storeLookup;
    //     const _ret = {
    //       indix_storeId: storeLookup.toString(),
    //       domain: _product.domain,
    //     };
    //     Meteor.call('retailerUpsert', _ret);
    //   }
    // }

    // try to scrap what we can w/ iframely
    // let _lookup = iframelyAPI(_product.url);

    _product.title = '';
    _product.description = '';
    _product.price = 0;
    // _product.images = [];

    let _lookup = iframelyAPI(url);
    // console.log("_lookup: ", _lookup);
    if (_lookup) {
      _product.title = _lookup.meta.title || '';
      _product.description = _lookup.meta.description || '';
      // _product.images = [];
      //
      // _.each(_lookup.links.thumbnail, (thumb) => {
      //   _product.images.push({
      //     _id: Math.floor((Math.random() * 100000) + 1),
      //     author: cusr._id,
      //     // created: new Date(),
      //     href: thumb.href.substring(0, 2) === '//' ? 'http:' + thumb.href : thumb.href,
      //     source: 'scraper',
      //   });
      // });
      //
      // _.each(_lookup.links.images, (image) => {
      //   _product.images.push({
      //     _id: Math.floor((Math.random() * 100000) + 1),
      //     author: cusr._id,
      //     // created: new Date(),
      //     href: image.href.substring(0, 2) === "//" ? "http:" + image.href : image.href,
      //     source: 'scraper',
      //   });
      // });
      //
      // _.each(_lookup.links.player, (video) => {
      //   _product.images.push({
      //     _id: Math.floor((Math.random() * 100000) + 1),
      //     author: cusr._id,
      //     // created: new Date(),
      //     href: video.href.substring(0, 2) === "//" ? "http:" + video.href : video.href,
      //     html: video.html || '',
      //     source: 'scraper',
      //   });
      // });
      //
      // // for giggles... add to videos too until it is ripped out...
      // _.each(_lookup.links.player, (video) => {
      //   _product.videos.push({
      //     _id: Math.floor((Math.random() * 100000) + 1),
      //     author: cusr._id,
      //     // created: new Date(),
      //     href: video.href.substring(0, 2) === "//" ? "http:" + video.href : video.href,
      //     html: video.html || '',
      //     source: 'scraper',
      //   });
      // });
    }

    if (! _lookup) {
      _lookup = embedlyAPI(url);
      // _lookup = embedlyAPI(_product.url);
      // console.log("_lookup: ", _lookup);
      if (_lookup) {
        if (_lookup.data && _lookup.data.title && _lookup.data.title.length > _product.title) {
          _product.title = _lookup.data.title;
        }

        if (_lookup.data && _lookup.data.description &&
          _lookup.data.description.length > _product.body) {
          _product.description = _lookup.data.description;
        }
      }
    }

    // _lookup = indixProductLookup(_product.url);
    // if (_lookup && _lookup.count > 0) {
    //   _.each(_lookup.products, (product) => {
    //     _.each(product.stores, (store) => {
    //       if (store.storeId === _product.indix_storeId) {
    //         // console.log('found store match: ', store);
    //         _product.indix_retailer = store.storeName;
    //         _product.price = store.offers[0].salePrice;
    //         _product.indix_salePrice = store.offers[0].salePrice;
    //         _product.indix_mpid = product.mpid;
    //         _product.indix_categoryName = product.categoryName;
    //         _product.indix_upcs = product.upcs;
    //         _product.indix_brandName = product.brandName;
    //         _product.indix_minSalePrice = product.minSalePrice;
    //         _product.indix_maxSalePrice = product.maxSalePrice;
    //       }
    //     });
    //   });
    // }

    console.log(_product, '\n\n\n');

    return (_product);
  },

  /**
  * scrape title & description
  * @param {String} url
  * @returns {string} _id (uniuqe)
  */
  scrapeTitleDescriptionImages(url) {
    console.log('\n \n \n');
    console.log('scrapeTitleDescription...');

    // check(Meteor.userId(), String);
    check(url, String);

    const cusr = Meteor.user();
    const _product = {};

    _product.userId = Meteor.userId();

    // remove any secondary+ parameters on the url
    _product.url = url.indexOf('&') > 0 ? (url.split('&', 1)).toString() : url;

    // isolate the domain from the url
    _product.domain = extractDomain(_product.url);

    // this lookup is all about getting the indix storeId
    const _retailer = Retailers.findOne({ domain: _product.domain.toLowerCase() });
    console.log('retailer', _retailer, _product);
    if (_retailer) {
      _product.aurlType = _retailer.aurlType || 0;
      _product.network = _retailer.network || '';
      _product.retailer = _retailer.retailer;
      _product.returnpol = _retailer.returnpol || '';
      _product.retailer411 = _retailer.retailer411 || '';
      // _product.indix_storeId = _retailer.indix_storeId || '';
    } else {
      _product.retailer = _product.domain.toLowerCase();
      _product.aurlType = 0;
      _product.network = '';
      _product.returnpol = '';
      _product.retailer411 = '';
    }
    console.log('retailer', _retailer, _product);

    // if it's a new indix storeId append to the retailer record
    // if (!_retailer || !_retailer.indix_storeId) {
    //   const storeLookup = indixStoreLookUp(extractDomain(_product.url));
    //   if (storeLookup) {
    //     _product.indix_storeId = storeLookup;
    //     const _ret = {
    //       indix_storeId: storeLookup.toString(),
    //       domain: _product.domain,
    //     };
    //     Meteor.call('retailerUpsert', _ret);
    //   }
    // }

    // try to scrap what we can w/ iframely
    // let _lookup = iframelyAPI(_product.url);
    _product.title = '';
    _product.description = '';
    _product.price = 0;
    _product.images = [];

    let _lookup = iframelyAPI(url);
    // console.log("_lookup: ", _lookup);
    if (_lookup) {
      _product.title = _lookup.meta.title || '';
      _product.description = _lookup.meta.description || '';
      _product.images = [];

      _.each(_lookup.links.thumbnail, (thumb) => {
        _product.images.push({
          _id: Math.floor((Math.random() * 100000) + 1),
          // author: cusr._id,
          // created: new Date(),
          href: thumb.href.substring(0, 2) === '//' ? 'http:' + thumb.href : thumb.href,
          source: 'scraper',
        });
      });

      _.each(_lookup.links.images, (image) => {
        _product.images.push({
          _id: Math.floor((Math.random() * 100000) + 1),
          // author: cusr._id,
          // created: new Date(),
          href: image.href.substring(0, 2) === "//" ? "http:" + image.href : image.href,
          source: 'scraper',
        });
      });

      _.each(_lookup.links.player, (video) => {
        _product.images.push({
          _id: Math.floor((Math.random() * 100000) + 1),
          // author: cusr._id,
          // created: new Date(),
          href: video.href.substring(0, 2) === "//" ? "http:" + video.href : video.href,
          html: video.html || '',
          source: 'scraper',
        });
      });

      // for giggles... add to videos too until it is ripped out...
      _.each(_lookup.links.player, (video) => {
        _product.videos.push({
          _id: Math.floor((Math.random() * 100000) + 1),
          // author: cusr._id,
          // created: new Date(),
          href: video.href.substring(0, 2) === "//" ? "http:" + video.href : video.href,
          html: video.html || '',
          source: 'scraper',
        });
      });
    }

    if (!_lookup) {
      // _lookup = embedlyAPI(_product.url);
      _lookup = embedlyAPI(url);
      // console.log("_lookup: ", _lookup);
      if (_lookup) {
        if (_lookup.data && _lookup.data.title && _lookup.data.title.length > _product.title) {
          _product.title = _lookup.data.title;
        }

        if (_lookup.data && _lookup.data.description &&
          _lookup.data.description.length > _product.body) {
          _product.description = _lookup.data.description;
        }
      }
    }

    // _lookup = indixProductLookup(_product.url);
    // if (_lookup && _lookup.count > 0) {
    //   _.each(_lookup.products, (product) => {
    //     _.each(product.stores, (store) => {
    //       if (store.storeId === _product.indix_storeId) {
    //         // console.log('found store match: ', store);
    //         _product.indix_retailer = store.storeName;
    //         _product.price = store.offers[0].salePrice;
    //         _product.indix_salePrice = store.offers[0].salePrice;
    //         _product.indix_mpid = product.mpid;
    //         _product.indix_categoryName = product.categoryName;
    //         _product.indix_upcs = product.upcs;
    //         _product.indix_brandName = product.brandName;
    //         _product.indix_minSalePrice = product.minSalePrice;
    //         _product.indix_maxSalePrice = product.maxSalePrice;
    //       }
    //     });
    //   });
    // }

    console.log(_product, '\n\n\n');

    return (_product);
  },

});
