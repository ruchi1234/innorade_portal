Pinterest = {};

Pinterest.requestCredential = function (options, credentialRequestCompleteCallback) {

    //console.log("request credential option"+ options);
    //console.log("request credential option"+ credentialRequestCompleteCallback);
    if (!credentialRequestCompleteCallback && typeof options === 'function') {
        credentialRequestCompleteCallback = options;
        options = {};
    }

    var config = ServiceConfiguration.configurations.findOne({service: 'pinterest'});
    console.log("config result" + JSON.stringify(config));
    if (!config) {                                                                                     // 17
        credentialRequestCompleteCallback && credentialRequestCompleteCallback(                          // 18
          new ServiceConfiguration.ConfigError());                                                       // 19
        return;                                                                                          // 20
      }

    var mobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|Windows Phone/i.test(navigator.userAgent);
    var display = mobile ? 'touch' : 'redirect';
    var scope = ['read_public','write_public'];
    var credentialToken = Random.id();

    var loginStyle = OAuth._loginStyle('pinterest', config, options);
    
    var state = OAuth._stateParam(loginStyle, credentialToken);
    if (config.scope) {
        scope = config.scope;
        if (options && options.requestPermissions) {
            scope = scope + ',';
        }
    }

    if (options && options.requestPermissions) {
        scope = scope + options.requestPermissions.join(',');
    }
    //alert(OAuth._redirectUri('pinterest', config));
    var custompinterestUrl  = 'https://e9023d0e.ngrok.io/';
    var loginUrl =
        'https://api.pinterest.com/oauth/?' +
            'response_type=code' +
            //'&redirect_uri=' + encodeURIComponent(Meteor.absoluteUrl('_oauth/pinterest?close', {secure: true,replaceLocalhost:true})) +                    
            '&redirect_uri=' + encodeURIComponent(custompinterestUrl+ '_oauth/pinterest?close') +
            '&client_id=' + config.clientId +
            '&scope=read_public,write_public'+
            '&state=' + OAuth._stateParam(loginStyle, credentialToken, options && options.redirectUrl);
    
    OAuth.initiateLogin(credentialToken, loginUrl, credentialRequestCompleteCallback);
    
};

