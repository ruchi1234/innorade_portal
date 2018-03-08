/*
** file: packages.mavenx-core.both.schema-root.js
** by: MavenX - tewksbum Mar 2016
** re: global schema reusable pieces
** ref:
*/

/*
* REGEX
*----------------------------------------------------------------------*/
if (Meteor.isDevelopment) {
    SimpleSchema.debug = true;
}

_.extend(Mavenx, {
    schemas : {
        RegEx : {
          FullName: new RegExp(/^(([a-zA-Z]+)([\s])([a-zA-Z]+))+$/),
          Phone: new RegExp(/^\s*(?:\+?(\d{1,3}))?([-. (]*(\d{3})[-. )]*)?((\d{3})[-. ]*(\d{2,4})(?:[-.x ]*(\d+))?)\s*$/),
          // blew up UserName to be whatever
          // UserName: new RegExp (/^[a-z0-9A-Z\S]{3,30}$/),
          // EBUrl: new RegExp (/^(http|https|ftp):\/\/\w+(\.\w+)*(:[0-9]+)?\/?(\/[.\S]*)*$/),
          // EBUrl: new RegExp (/^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/),
          EBUrl: new RegExp (/[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/g),
          Ip: new RegExp (/^\b\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}\b$/),
          Url: new RegExp(
                "^" +
                    // protocol identifier
                "(?:(?:https?|ftp)://)" +
                    // user:pass authentication
                "(?:\\S+(?::\\S*)?@)?" +
                "(?:" +
                    // IP address exclusion
                    // private & local networks
                "(?!(?:10|127)(?:\\.\\d{1,3}){3})" +
                "(?!(?:169\\.254|192\\.168)(?:\\.\\d{1,3}){2})" +
                "(?!172\\.(?:1[6-9]|2\\d|3[0-1])(?:\\.\\d{1,3}){2})" +
                    // IP address dotted notation octets
                    // excludes loopback network 0.0.0.0
                    // excludes reserved space >= 224.0.0.0
                    // excludes network & broacast addresses
                    // (first & last IP address of each class)
                "(?:[1-9]\\d?|1\\d\\d|2[01]\\d|22[0-3])" +
                "(?:\\.(?:1?\\d{1,2}|2[0-4]\\d|25[0-5])){2}" +
                "(?:\\.(?:[1-9]\\d?|1\\d\\d|2[0-4]\\d|25[0-4]))" +
                "|" +
                    // host name
                "(?:(?:[a-z\\u00a1-\\uffff0-9]-*)*[a-z\\u00a1-\\uffff0-9]+)" +
                    // domain name
                "(?:\\.(?:[a-z\\u00a1-\\uffff0-9]-*)*[a-z\\u00a1-\\uffff0-9]+)*" +
                    // TLD identifier
                "(?:\\.(?:[a-z\\u00a1-\\uffff]{2,}))" +
                    // TLD may end with dot
                "\\.?" +
                ")" +
                    // port number
                "(?::\\d{2,5})?" +
                    // resource path
                "(?:[/?#]\\S*)?" +
                "$", "i"
            )
        },
        DenormObjectField: {
            type: Object,
            blackbox: true,
            optional: true,
            autoValue() {
                if (!this.isFromTrustedCode) {
                    this.unset();
                }
            },
        },
        DenormCountField: {
            type: Number,
            autoValue() {
                if (this.isInsert) {
                    return 0;
                }

                if (!this.isFromTrustedCode) {
                    this.unset();
                }
            },
        },
    },
});

/*
* ORDERED
*----------------------------------------------------------------------*/

_.extend(Mavenx.schemas, {
    CategoryTypes : {
       0: "Named Account",
       1: "Valentine's Day",
       2: "Home and Kitchen",
       3: "Sporting Goods",
       4: "Baby",
       5: "Consumer Electronics",
       6: "Gifts",
       100: "Something Else..."
    }
});

_.extend(Mavenx.schemas, {
    reverseCategoryTypes : _.invert(Mavenx.schemas.CategoryTypes)
});

/*
* SUFFIXES / HELPERS
*----------------------------------------------------------------------*/

// TODO: verify this has been replaced by timestamp package
_.extend(Mavenx.schemas, {
    // DateAudit : new SimpleSchema({
    //     created: {
    //         type: Date,
    //         index: true,
    //         //denyUpdate: true,
    //         // TODO: pretty sure where this bombs is when the upsert updates (rather than insert)
    //         denyUpdate: false,  // not sure this is relevant,
    //         optional: true, // added this TODO:
    //         autoValue: function () {
    //             if (this.isInsert) {
    //                 return new Date;
    //             } else if (this.isUpsert) {
    //                 return {
    //                     $setOnInsert: new Date
    //                 };
    //             } else {
    //                 this.unset();
    //             }
    //         }
    //     },
    //     updated: {
    //         type: Date,
    //         optional: true,  //added this TODO:
    //         autoValue: function () {
    //             return new Date;
    //         }
    //     }
    // }),
    // UserAudit : new SimpleSchema({
    //    created_by: {
    //        type: SimpleSchema.RegEx.Id,
    //        optional: false,
    //        index: true
    //    }
    // })
});

// //has to come after DateAudit
// _.extend(Mavenx.schemas, {
//     clientErrors : new SimpleSchema([{
//
//       //regEx: SimpleSchema.RegEx.Id
//       "userId": {
//           type: String,
//           optional: true,
//           regEx: SimpleSchema.RegEx.Id
//       },
//       "file": {
//           type: String,
//           optional: true
//       },
//       "function": {
//           type: String,
//           optional: true
//       },
//       "message": {
//           type: String,
//           optional: true
//       },
//       //role of participant on hunt
//       "error": {
//           type: Object,
//           optional: true,
//           blackbox: true
//       },
//     }, Mavenx.schemas.DateAudit])
// });

_.extend(Mavenx.schemas, {
    pwdCheck : new SimpleSchema({
      	password: {
      		type: String,
      		optional: false,
      		min: 3
      	}
    })
});

// _.extend(Mavenx.schemas, {
//     UserRef : new SimpleSchema({
//         //regEx: SimpleSchema.RegEx.Id
//         "userId": {
//             type: String,
//             optional: true,
//             regEx: SimpleSchema.RegEx.Id
//         },
//         "username": {
//             type: String,
//             optional: true
//         },
//         "name": {
//             type: String,
//             optional: true
//         },
//         "image_url": {
//             type: String,
//             optional: true,
//             regEx : Mavenx.schemas.RegEx.EBUrl
//         },
//     // }, Mavenx.schemas.DateAudit])
//     })
// });
