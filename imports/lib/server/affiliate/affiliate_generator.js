// import { Meteor } from 'meteor/meteor';
// import { Match, check } from 'meteor/check';

import Retailers from '/imports/modules/retailers/collection';

import { getCJLink } from '/imports/lib/server/affiliate/com_junc';
import { getShareASale } from '/imports/lib/server/affiliate/share_a_sale';
import { getLinkShare } from '/imports/lib/server/affiliate/link_share';
import { getProsperentLink } from '/imports/lib/server/affiliate/prosperent';
import { getVigLink } from '/imports/lib/server/affiliate/vig_link';
import { getImpactRadius } from '/imports/lib/server/affiliate/impact_radius';

/**
 * generateAurl.
 * @param {String} domain
 * @param {String} url
 * @param {String} pid
 * @returns {String} aurl
 */
export const generateAurl = (domain, url, pid) => {
  console.log('in generateAurl:');

  // check(domain, Match(String));
  // check(url, Match(String));
  // check(pid, String);

  let aurl = '';
  const ret = Retailers.findOne({ domain });

  let urlOrUTM = url;
  console.log("Ret.UTM: ", ret.UTM);
  if (ret.UTM) {
    console.log("Ret test passed");
    urlOrUTM = ret.UTM;
  }
  const gonk = {
    url: urlOrUTM,
    callback: pid,
  };
  console.log("urlOrUTM: ", urlOrUTM);

  if (ret && ret.network) {
    switch (ret.network) {
      case 'LS':
        aurl = getLinkShare(gonk, ret.networkId && ret.networkId.toString() || '');
        break;
      case 'SS':
        aurl = getShareASale(gonk, ret.networkId && ret.networkId.toString() || '');
        break;
      case 'P':
        aurl = getProsperentLink(gonk);
        break;
      case 'PR':
        aurl = getProsperentLink(gonk);
        break;
      case 'VL':
        aurl = getVigLink(gonk);
        break;
      case 'CJ':
        aurl = getCJLink(gonk);
        break;
      case 'IR':
        aurl = getImpactRadius(gonk, ret.networkId && ret.networkId.toString() || '');
        break;
      default:
        aurl = getVigLink(gonk);
    }
  } else {
    aurl = getVigLink(gonk);
  }
  console.log('aurl');
  return aurl;
};

/**
* generateBPIDAurl.
* @param {String} domain
* @param {String} url
* @param {String} bpid
* @returns {String} aurl
*/
export const generateBPIDAurl = (domain, url, bpid) => {
  console.log('in generateBPIDAurl:');

  let aurl = '';

 // console.log('domain: ', domain);
  const ret = Retailers.findOne({ domain: domain });
  if (ret) {
    console.log('ret: ', ret);

    let urlOrUTM = url;
    console.log("Ret.UTM: ", ret.UTM);

    if (ret.UTM) {
      console.log("Ret test passed");
      urlOrUTM = ret.UTM;
    }

    const gonk = {
      url: urlOrUTM,
      callback: bpid,
    };

    console.log("urlOrUTM: ", urlOrUTM);

    if (ret && ret.network) {
      switch (ret.network) {
        case 'LS':
          aurl = getLinkShare(gonk, ret.networkId && ret.networkId.toString() || '');
          break;
        case 'SS':
          aurl = getShareASale(gonk, ret.networkId && ret.networkId.toString() || '');
          break;
        case 'P':
          aurl = getProsperentLink(gonk);
          break;
        case 'PR':
          aurl = getProsperentLink(gonk);
          break;
        case 'VL':
          aurl = getVigLink(gonk);
          break;
        case 'CJ':
          aurl = getCJLink(gonk);
          break;
        case 'IR':
          aurl = getImpactRadius(gonk, ret.networkId && ret.networkId.toString() || '');
          break;
        default:
          aurl = getVigLink(gonk);
      }
    } else {
      aurl = getVigLink(gonk);
    }
   
    return aurl;
  }
  else
  {
    return 0;
  }
};
