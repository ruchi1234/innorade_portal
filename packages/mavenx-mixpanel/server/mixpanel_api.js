var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    __slice = Array.prototype.slice;

var querystring = Npm.require('querystring');
var crypto = Npm.require('crypto');
var https = Npm.require('https');
var mpEndpoint = 'http://mixpanel.com/api/2.0/engage/?';
var mpAliasEndpoint = 'http://api.mixpanel.com/track/?';

MixpanelAPI = (function() {

    function MixpanelAPI(options) {

        //console.log("init mixpanel constructor");
        var key, val;
        this.options = {
            api_key: null,
            api_secret: null,
            default_valid_for: 60,
            log_fn: this.log
        };
        for (key in options) {
            val = options[key];
            this.options[key] = val;
        }
        if (!this.options.api_key && this.options.api_secret) {
            throw new Error('MixpanelAPI needs token and secret parameters');
        }
    }


    //MixpanelAPI.prototype.export_data = function(params, valid_for, cb) {
    MixpanelAPI.prototype.lookupPeople = function(params, valid_for, cb) {

        var params_qs, req, queryURL;
        if (typeof params !== 'object') {
            throw new Error('export_data(params, [valid_for], cb) expects an object params');
        }
        valid_for || (valid_for = this.options.default_valid_for);

        params.api_key = this.options.api_key;
        params.expire = Math.floor(this._get_utc() / 1000) + valid_for;
        params = this._prep_params(params);
        params_qs = querystring.stringify(this._sign_params(params));

        queryURL = mpEndpoint + params_qs;

        console.log(queryURL);

        try {
            var response = HTTP.get(queryURL).content;
            console.log("raw mixpanel endpoint response...");
            console.log(response);
            return response;
        } catch (e) {
            console.log('An error occurred: ' + e);
            return null;
        }
    };


    MixpanelAPI.prototype.aliasUserId = function(params, valid_for, cb) {

        console.log("\n");
        console.log("MixpanelAPI.prototype.aliasUserId");
        console.log("\n");

        var params_qs, req, queryURL;
        if (typeof params !== 'object') {
            throw new Error('export_data(params, [valid_for], cb) expects an object params');
        }

        //var aliasText = '{"event": "pants pooped", "properties": {"distinct_id": "'+params.mixpid+'", "token": "' +params.token + '"} }';
        var aliasText = '{"event": "$create_alias", "properties": {"distinct_id": "'+params.mxpdid+'", "alias": "' +params.userId+ '", "token": "' +params.token + '"} }';

        var aliasEncode = Base64.encode(aliasText);
        console.log("encoding data");
        console.log(aliasEncode);

        console.log("decoding data");
        console.log(Base64.decode(aliasEncode));

        queryURL = "http://api.mixpanel.com/track/?data=" + aliasEncode;
        //console.log(queryURL);

        try {
            var response = HTTP.get(queryURL).content;
            console.log("raw mixpanel endpoint response...");
            console.log(response);
            return response;
        } catch (e) {
            console.log('An error occurred: ' + e);
            return null;
        }
    };

    var Base64 = {

        // private property

        _keyStr: "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=",

        // public method for encoding

        encode: function (input) {

            var output = "";
            var chr1, chr2, chr3, enc1, enc2, enc3, enc4;
            var i = 0;
            input = Base64._utf8_encode(input);

            while (i < input.length) {
                chr1 = input.charCodeAt(i++);
                chr2 = input.charCodeAt(i++);
                chr3 = input.charCodeAt(i++);
                enc1 = chr1 >> 2;
                enc2 = ((chr1 & 3) << 4) | (chr2 >> 4);
                enc3 = ((chr2 & 15) << 2) | (chr3 >> 6);
                enc4 = chr3 & 63;
                if (isNaN(chr2)) {
                    enc3 = enc4 = 64;
                } else if (isNaN(chr3)) {
                    enc4 = 64;
                }
                output = output +
                    this._keyStr.charAt(enc1) + this._keyStr.charAt(enc2) +
                    this._keyStr.charAt(enc3) + this._keyStr.charAt(enc4);
            }
            return output;
        },

        _utf8_encode : function (string) {

            string = string.replace(/\r\n/g,"\n");
            var utftext = "";

            for (var n = 0; n < string.length; n++) {
                var c = string.charCodeAt(n);
                if (c < 128) {
                    utftext += String.fromCharCode(c);
                }
                else if((c > 127) && (c < 2048)) {
                    utftext += String.fromCharCode((c >> 6) | 192);
                    utftext += String.fromCharCode((c & 63) | 128);
                }
                else {
                    utftext += String.fromCharCode((c >> 12) | 224);
                    utftext += String.fromCharCode(((c >> 6) & 63) | 128);
                    utftext += String.fromCharCode((c & 63) | 128);
                }
            }
            return utftext;
        },

        // public method for decoding
        decode : function (input) {
            var output = "";
            var chr1, chr2, chr3;
            var enc1, enc2, enc3, enc4;
            var i = 0;
            input = input.replace(/[^A-Za-z0-9\+\/\=]/g, "");
            while (i < input.length) {
                enc1 = this._keyStr.indexOf(input.charAt(i++));
                enc2 = this._keyStr.indexOf(input.charAt(i++));
                enc3 = this._keyStr.indexOf(input.charAt(i++));
                enc4 = this._keyStr.indexOf(input.charAt(i++));
                chr1 = (enc1 << 2) | (enc2 >> 4);
                chr2 = ((enc2 & 15) << 4) | (enc3 >> 2);
                chr3 = ((enc3 & 3) << 6) | enc4;
                output = output + String.fromCharCode(chr1);

                if (enc3 != 64) {
                    output = output + String.fromCharCode(chr2);
                }
                if (enc4 != 64) {
                    output = output + String.fromCharCode(chr3);
                }
            }
            output = Base64._utf8_decode(output);

            return output;

        },

        // private method for UTF-8 decoding
        _utf8_decode : function (utftext) {
            var string = "";
            var i = 0;
            var c = c1 = c2 = 0;

            while ( i < utftext.length ) {
                c = utftext.charCodeAt(i);
                if (c < 128) {
                    string += String.fromCharCode(c);
                    i++;
                }
                else if((c > 191) && (c < 224)) {
                    c2 = utftext.charCodeAt(i+1);
                    string += String.fromCharCode(((c & 31) << 6) | (c2 & 63));
                    i += 2;
                }
                else {
                    c2 = utftext.charCodeAt(i+1);
                    c3 = utftext.charCodeAt(i+2);
                    string += String.fromCharCode(((c & 15) << 12) | ((c2 & 63) << 6) | (c3 & 63));
                    i += 3;
                }
            }

            return string;
        }
    };

    MixpanelAPI.prototype.request = function(endpoint, params, valid_for) {
        var params_qs, req, req_opts;
        try {
            if (typeof params !== 'object') {
                throw new Error('request(endpoint, params, [valid_for], [cb]) expects an object params');
            } else if (typeof endpoint !== 'string') {
                throw new Error('endpoint must be a string, not ' + endpoint);
            }

            valid_for || (valid_for = this.options.default_valid_for);

            params.api_key = this.options.api_key;
            params.expire = Math.floor(this._get_utc() / 1000) + valid_for;

            params = this._prep_params(params);
            params_qs = querystring.stringify(this._sign_params(params));

            req_opts = 'http://mixpanel.com/api/2.0/' + endpoint + '/?' + params_qs;

            try {
                var responseData = JSON.parse(HTTP.get(req_opts).content);
                return responseData;
            } catch (e) {
                console.log('An error occurred: ' + e);
                return null;
            }
        } catch (e) {
            console.log('An error occurred: ' + e);
            return null;
        }
    };


    //https://developer.mozilla.org/en-US/docs/Web/API/WindowBase64/btoa
    //https://mixpanel.com/help/reference/http#distinct-id-alias
    MixpanelAPI.prototype.createAlias = function(endpoint, params, valid_for) {

        var params_qs, req, req_opts;

        try {

            if (typeof params !== 'object') {
                throw new Error('request(endpoint, params, [valid_for], [cb]) expects an object params');
            } else if (typeof endpoint !== 'string') {
                throw new Error('endpoint must be a string, not ' + endpoint);
            }

            valid_for || (valid_for = this.options.default_valid_for);

            //{
            //    "event": "$create_alias",
            //    "properties": {
            //    "distinct_id": "ORIGINAL_ID",
            //        "alias": "NEW_ID",
            //        "token": "e3bc4100330c35722740fb8c6f5abddc"
            //}
            //}

            var text = '{ "event" : "$create_alias", ' +
                '"properties": { ' +
                '"distinct_id": ' + params.distinct_id + ', ' +
                '"alias": ' + params.alias + ', ' +
                '"token": ' + Meteor.settings.public.mixpanel.token + '} }';
            //var obj = JSON.parse(text);

            var encodedData = window.btoa(text); // encode a string

            //params.api_key = this.options.api_key;
            //params.expire = Math.floor(this._get_utc() / 1000) + valid_for;
            //params = this._prep_params(params);
            //params_qs = querystring.stringify(this._sign_params(params));

            req_opts = mpAliasEndpoint + "data=" + encodedData;

            try {
                var responseData = JSON.parse(HTTP.get(req_opts).content);
                return responseData;
            } catch (e) {
                console.log('An error occurred: ' + e);
                return null;
            }

        } catch (e) {
            console.log('An error occurred: ' + e);
            return null;
        }
    };


    MixpanelAPI.prototype._get_utc = function() {
        var d = new Date(),
            local_time = d.getTime(),
        // getTimezoneOffset returns diff in minutes (??? why?)
            local_offset = d.getTimezoneOffset() * 60 * 1000;
        return local_time + local_offset;
    };


    MixpanelAPI.prototype._prep_params = function(params) {
        var p;
        for (p in params) {
            if (params.hasOwnProperty(p) && Array.isArray(params[p])) {
                params[p] = JSON.stringify(params[p]);
            }
        }
        return params;
    };


    MixpanelAPI.prototype._sign_params = function(params) {
        // This signs unicode strings differently than the mixpanel backend
        var hash, key, keys, param, to_be_hashed, _i, _len;
        if (!(params != null ? params.api_key : void 0) || !(params != null ? params.expire : void 0)) {
            throw new Error('all requests must have api_key and expire');
        }
        keys = Object.keys(params).sort();
        to_be_hashed = '';
        for (_i = 0, _len = keys.length; _i < _len; _i++) {
            key = keys[_i];
            if (key === 'callback' || key === 'sig') {
                continue;
            }
            param = {};
            param[key] = params[key];
            to_be_hashed += key + '=' + params[key];
        }
        hash = crypto.createHash('md5');
        hash.update(to_be_hashed + this.options.api_secret);
        params.sig = hash.digest('hex');
        return params;
    };


    MixpanelAPI.prototype.log = function() {
        var err, other_stuff;
        err = arguments[0], other_stuff = 2 <= arguments.length ? __slice.call(arguments, 1) : [];
        if (err instanceof Error) {
            console.error('Error in MixpanelAPI: ' + err.message);
            return console.error(err);
        }
        return console.log.apply(console, arguments);
    };
    return MixpanelAPI;


})();
