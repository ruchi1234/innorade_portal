import '/imports/startup/mongo_collection_extensions';

import '/imports/modules/boards/server/hooks';
import '/imports/modules/clips/server/hooks';
import '/imports/modules/contacts/server/hooks';
import '/imports/modules/products/server/hooks';
import '/imports/modules/user_product_counts/server/hooks';
import '/imports/modules/users/server/hooks';


// These should be the only collection modules needed to import, since
// Other collections are generally required elsewhere, these have
// side effects but no real export
import '/imports/modules/users/users';
import '/imports/modules/users/server/create_user';
import '/imports/modules/uploads';


import '/imports/api/boards/server/publications';
import '/imports/api/clips/server/publications';
import '/imports/api/categories/server/publications';
import '/imports/api/contacts/server/publications';
import '/imports/api/contact_emails/server/publications';
import '/imports/api/products/server/publications';
import '/imports/api/retailers/server/publications';
import '/imports/api/user_ledgers/server/publications';
import '/imports/api/user_product_count/server/publications';
import '/imports/api/users/server/publications';
import '/imports/api/users/server/alias';


import '/imports/api/ads/server/methods';
import '/imports/api/boards/methods';
import '/imports/api/boards/methods/favorite';
import '/imports/api/clips/methods';
import '/imports/api/clips/methods/favorite';
import '/imports/api/invitations/methods';
import '/imports/api/products/methods';
import '/imports/api/products/methods/favorite';
import '/imports/api/retailers/methods';
import '/imports/api/users/methods';
import '/imports/api/users/methods/favorite';

import '/imports/startup/autoseed';
import '/imports/startup/seed';

import '/imports/startup/server/prerender';
import '/imports/startup/server/email';
import '/imports/startup/server/email_ssr';
import '/imports/startup/server/migrations/start.js';


import '/imports/lib/server/scrape/methods';
import '/imports/lib/server/telize';
import '/imports/lib/server/mxpAPI';

import { generateBPIDAurl } from '/imports/lib/server/affiliate/affiliate_generator';
import affiliatedLink from '/imports/modules/affiliatedLink/collections'
import Retailers from '/imports/modules/retailers/collection';


function domain_from_url(url)
{
    let result
    let match
 
    if(match = url.match(/^(?:https?:\/\/)?(?:[^@\n]+@)?(?:www\.)?([^:\/\n]+)/im))
    {
        result = match[1];

        if(match = result.match(/^[^\.]+\.(.+\..+)S/))
        {
            result = match[1];
        }

    }
    return result;
}
Meteor.methods({
    'urlAffilliation': function(currentDomain){
       
        let url = "https://www.amazon.com";
        let domainFromUrl = domain_from_url(url);
         console.log(domainFromUrl);
        //const hasRetailers = Retailers.findOne({ domain: domainFromUrl });
        
        const aurl =  generateBPIDAurl(domainFromUrl,url,'NO_CLIP')
       
        if(aurl)
        {
            affiliatedLink.insert({
                domain: domainFromUrl,
                url: url,
                affiliated_link: aurl,
                affiliatedLinkForUserId: Meteor.userId()
            })
            console.log("aurl"+ aurl);
            return aurl;
        }
        else
        {
           return 0;
        }
        
        // Create user here
    }
});
Meteor.methods({
    'pinterestLink': function(){
        const pinterestCredential = Meteor.user().services.pinterest;
        //console.log("meteor user service" + JSON.stringify(pinterestCredential));
        var userPinList = getPins(pinterestCredential.accessToken);
        
        const ret = Retailers.find({}, {fields: {domain:1, _id:0}}).fetch();
       
        if(ret)
        {
           
            var retailerDomainList  = ret.map(a => a.domain);
           console.log("retailerDomainList"+retailerDomainList);
            
            userPinList =  userPinList.data;
           // userPinList = JSON.parse(userPinList);
           
            _.forEach(userPinList,function(item)
            { 
                //editPins(pinterestCredential.accessToken,item.id,'mavenx.com');
              
              let domainFromUrl = domain_from_url(item.original_link);
              console.log(domainFromUrl); 
              if(retailerDomainList.indexOf(domainFromUrl) > -1)
               {
                   console.log('is existing domain');
                   editPins(pinterestCredential.accessToken,item.id,'mavenx.com');
                   
                   affiliatedLink.insert({
                        domain: domainFromUrl,
                        url: item.link,
                        affiliated_link: item.url,
                        affiliatedLinkForUserId: Meteor.userId()
                    });
               }
               //console.log("original "+item.original_link);
            });
            
        }
        else
        {
            console.log("unsu");

        }
         
        console.log('i am calling piterest ');
        //getProfile(pinterestCredential.accessToken);
        return userPinList;
    }
});
var getProfile = function(accessToken){
    const url = `https://api.pinterest.com/v1/me/?access_token=${accessToken}&fields=counts%2Curl%2Cusername`;
    HTTP.call('GET', url, (err, resp) => {
      if (!err) {
       console.log(_.get(resp, 'data.data.url'));
      }
    }); 
      //console.log(myProfile);
}
var getPins = function (accessToken) {                                                // 90
    var pinList;

    
  
    try {                                                                                           // 91
        pinList =  HTTP.get("https://api.pinterest.com/v1/me/pins", {                                       // 92
        params: {                                                                                   // 93
          access_token: accessToken,
          fields: 'id,link,note,url,original_link'
          // 94                                                                           // 95
        }                                                                                           // 96
      }).data;                                                                                     // 97
    } catch (err) {                                                                                 // 98
      throw _.extend(new Error("Failed to fetch identity from Facebook. " + err.message),           // 99
        {response: err.response});                                                     // 100
    }  
    return   pinList;   
                                                                                        // 101
};

var editPins = function (accessToken,pinId,link)
{
    var url = `https://api.pinterest.com/v1/pins/${pinId}/?access_token=${accessToken}`;
    HTTP.call('PATCH', url, {
          headers:{
            'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
          },
          params: {link: link}
    } , (err, resp) => {
      if (!err) {
       console.log(resp);
      }
      else
      {
         // console.log(err);
      }
    });
   
}

Picker.route( '/getUserInfo', function( params, request, response, next ) {
    let domainName = domain_from_url(params.query.domain);
   
    if(domainName)
    {
        let isExistingDomain = Retailers.findOne({ domain: domainName });
        var result;
        if(isExistingDomain)
        {
            result = {
                isRegister : 1,
                status: 200,
            }
           
        }
        else
        {
            result = {
                isRegister : 0,
                status: 200,
            }
        }
    }
    else{
        result = {
            isRegister : 0,
            status: 200,
            message: 'Invailid result'
        }
       
       
    }
   
    response.setHeader('Access-Control-Allow-Origin','*');
    response.end(JSON.stringify(result));
});
/*
Router.route('/getUserInfo',{where: 'server'})
    .get(function(){
        let domainName = domain_from_url(this.request.query.domain);
        if(domainName)
        {
            let isExistingDomain = Retailers.findOne({ domain: domainName });
            var response;
            if(isExistingDomain)
            {
                response = {
                    isRegister : 1,
                    status: 200,
                }
            }
            else
            {
                response = {
                    isRegister : 0,
                    status: 200,
                }
            }
        }
        else{
            response = {
                status: 500,
                message: 'Invaild data'
            }
        }
        
        
        this.response.setHeader('Content-Type','application/json');
        this.response.setHeader('Access-Control-Allow-Origin','*');
        this.response.end(JSON.stringify(response));
});
*/
