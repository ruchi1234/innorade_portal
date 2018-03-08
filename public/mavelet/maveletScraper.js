/*
 * Note, we expect 'window.mavenHost' to exist from
 * the bookmark.  Lacking it is considered a bug.
 */
(function (window, document, config) {
  // 'use strict';
  const Mavelet = window[config.k] = {
    config,
    description: '',
    doc: {},
    hazAtLeastOneGoodThumb: 0,
    hazCalledForInfo: {},
    hazCanonical: false,
    hazPinningNow: false,
    saveScrollTop: null,
    tag: [],
    thumbed: [],
    title: '',
    url: window.location,
    /**
     * Gets or sets the attribute of a element.
     *
     * @param obj    Element.
     * @param attr  Attribute to retrieve or set.
     * @param val   [Optional] Value to set to the attribute.
     *              If null, current attribute value will be returned.
     */

    // attribute: function(obj, attr, val) {
    attribute(obj, attr, val) {
      // Get.
      if (!val) {
        return (typeof obj[attr] === 'string') ? obj[attr] : obj.getAttribute(attr);
      }
      // Set.
      if (typeof obj[attr] === 'string') {
        obj[attr] = val;
      } else {
        obj.setAttribute(attr, val);
      }
      return val;
    },

    /**
     * Adds event listeners to DOM.
     */
    behavior() {
      Mavelet.listen(document, 'click', Mavelet.click);
      Mavelet.listen(document, 'keydown', Mavelet.keydown);
    },

    /**
    * Utility method to make AJAX calls (to get extendedInfo).
    *
    * @param url      URL to request.
    * @param callback Function to execute on response.
    */
   call(url, callback) {
      // TODO: could do the iframely type of calls from here...
      var format = 'json';
      var http = false;
      // OldIE cross-domain requests must be done with the XDomainRequest object.
      if (typeof XDomainRequest !== 'undefined') {

          var http = new XDomainRequest(); // Creates a new XDR object.

          // The object is complete.
          http.onload = function () {

              var result = "";
              if (http.responseText) {
                  result = http.responseText;
              }

              //If the return is in JSON format, eval the result before returning it.
              if (format.charAt(0) === "j") {
                  //\n's in JSON string, when evaluated will create errors in IE
                  result = result.replace(/[\n\r]/g,"");
                  result = eval('('+result+')');
              }

              //Give the data to the callback function.
              if (callback) {
                  callback(result);
              }
          };

          // Creates a connection with a domain's server.
          http.open("get", url);
          // Transmits a data string to the server.
          http.send();

          return;
      }

      // "Modern" browsers:
      // Use IE's ActiveX items to load the file.
      if (typeof ActiveXObject !== 'undefined') {

          try {http = new ActiveXObject("Msxml2.XMLHTTP");}
          catch (e) {
              try { http = new ActiveXObject("Microsoft.XMLHTTP"); }
              catch (e) { http = false; }
          }

      // If ActiveX is not available, use the XMLHttpRequest of Firefox/Mozilla etc. to load the document.
      } else if (window.XMLHttpRequest) {
          try { http = new XMLHttpRequest(); }
          catch (e) { http = false; }
      }

      if ( ! http || ! url) {
          return;
      }

      if (http.overrideMimeType) {
          http.overrideMimeType('text/xml');
      }

      //Kill the Cache problem in IE.
      var now = "uid=" + new Date().getTime();
      url += (Mavelet.indexOf(url, "?") + 1) ? "&" : "?";
      url += now;

      http.open("GET", url, true);
      http.onreadystatechange = function () { // Call a function when the state changes.
          if (http.readyState === 4) { // Ready State will be 4 when the document is loaded.
              if (http.status === 200) {

                  var result = "";

                  if (http.responseText) {
                      result = http.responseText;
                  }

                  // If the return is in JSON format, eval the result before returning it.
                  if (format.charAt(0) === "j") {
                      // \n's in JSON string, when evaluated will create errors in IE
                      result = result.replace(/[\n\r]/g,"");
                      result = eval('('+result+')');
                  }

                  // Give the data to the callback function.
                  if (callback) {
                      callback(result);
                  }
              }
          }
      };
     http.send(null);
   },

    /**
     * Checks if document is valid for pinning.
     */
    checkPage() {
      // certain special URL's short circuit the checkTags loop...
      if (!Mavelet.checkUrl()) {
        Mavelet.checkTags();
      }
      return true;
    },

    /**
     * Checks document tags for pinneable elements.
     */
    checkTags() {
      var tag;
    
      var tags;
      var tagName;
      var zephlen;
      for (var i = 0; i < Mavelet.config.check.length; i++) {
        tags = document.getElementsByTagName(Mavelet.config.check[i]);
        if (tags.length > 100) {
          zephlen = 100;
        } else {
          zephlen = tags.length
        }
        for (var j = 0; j < zephlen; j++) {
          if (!Mavelet.attribute(tags[j], 'nopin') && tags[j].style.display !== 'none' &&
            tags[j].style.visibility !== 'hidden' && (Mavelet.attribute(tags[j], 'hidefocus')
              !== 'true')) {
            Mavelet.tag.push(tags[j]);
          }
        }
      }
      for (var k = 0; k < Mavelet.tag.length; k++) {
        tag = Mavelet.tag[k];
        tagName = tag.tagName.toLowerCase();
        if (Mavelet.hazTag[tagName]) {
          Mavelet.hazTag[tagName](tag);
        }
      }
      return Boolean(Mavelet.tag.length);
    },

    /**
     * Checks if the page is one of the special URL. If so, special thumbs are generated.
     */
    checkUrl() {
      // turned this off for now...  Check Tags runs EVERYWHERE...
      var i;
      var found = false;
      for (i in Mavelet.config.url) {
        if (document.URL.match(Mavelet.config.url[i])) {
          //Mavelet.hazUrl[i]();
          //found = true;
        }
      }
      return found;
    },

    /**
     * Event handler for clicks.
     */
    click(event) {

      function searchArrayKey(nameKey, myArray){
        for (var i=0; i < myArray.length; i++) {
          if (myArray[i].name === nameKey) {
            return myArray[i];
          }
        }
      }

      console.log("click");
      event = event || window.event;
      const element = event.target || event.srcElement;

      if (element.id === Mavelet.config.k + '_x') {
        Mavelet.close(); // Clicking the Cancel button closes the bookmarklet.
      } else if (element.id === Mavelet.config.k + '_submit') {
        // clicking the Submit button
        const args = {
          description: Mavelet.description,
          title: Mavelet.title,
          thumbed: [],
          url: Mavelet.url,
        };
        Mavelet.thumbed.forEach(function(thumb){
          if (thumb.selected) {
            args.thumbed.push(thumb);
          }
        });
        const args_string = encodeURIComponent(JSON.stringify(args));
        Mavelet.pin(args_string);
      } else {
        // console.log('x: ', event.target.attributes[0].name.trim());
        // console.log('x: ', event.target.attributes);
        var resultObject = searchArrayKey('_id', event.target.attributes);
        console.log('object: ', resultObject);
        // if (event.target.attributes[0].name.trim() === '_id') {
        if (resultObject) {
          if (element.type !== 'checkbox') {
            const chkbox = document.getElementById(`${Mavelet.config.k}_selected_${element.src}`);
            console.log("chkbox: ", chkbox);
            chkbox.checked = chkbox && chkbox.checked ? !chkbox.checked : 'true';
          }
          Mavelet.thumbed.forEach(function(thumb) {
            console.log("thumb: ", thumb);
            // if (thumb._id.toString().trim() === event.target.attributes[0].value.trim()) {
            if (thumb._id.toString().trim() === resultObject.value.trim()) {
              thumb.selected = !thumb.selected;
            }
          });
        }
      }
    },

    /**
     * Closes the bookmarklet and cleans up the DOM.
     *
     * @param msg Optional message to show to user.
     */
    close(msg) {
      // Remove elements from DOM.
      if (document.head) {
        document.head.removeChild(Mavelet.doc.styl);
      }
      if (document.body) {
        document.body.removeChild(Mavelet.doc.main);
      }
      window.hazPinningNow = false;
      if (msg) {
        window.alert(msg);
      }
      // Detach event listeners.
      Mavelet.unlisten(document, 'click', Mavelet.click);
      Mavelet.unlisten(document, 'keydown', Mavelet.keydown);
      // Return original scroll.
      window.scroll(0, Mavelet.saveScrollTop);
    },

    /**
     * Gets the max height of the document.
     */
    getHeight() {
      return Math.max(document.body.scrollHeight, document.body.offsetHeight, document.body.clientHeight);
    },

    /*
     * Gets more info about a pinnable element querying the API of the content provider.
     * Currently works only with YouTube.
     * TODO: Make it independent from YouTube so more sites can be added easily.
     *
     * @param params   Parameters of the call.
     * @param callback Function to execute when receiving the response.
    */
    getExtendedInfo(params, callback) {
      var info;

      if (Mavelet.hazCalledForInfo[params]) {
        return;
      }
      Mavelet.hazCalledForInfo[params] = true;

      Mavelet.call(Mavelet.config.api[params.site].replace('{{id}}', params.id), function(response) {
        info = {
          title: response.entry.title.$t,
          url: response.entry.link[0].href,
          thumb: response.entry.media$group.media$thumbnail[2].url,
        };
        callback(info);
      });
    },

    getId(props) {
      // used to do extendedprop lookup
      var id;
      for (var j = props.u.split('?')[0].split('#')[0].split('/'); ! id;) {
        id = j.pop();
      }
      if (props.r) {
        id = parseInt(id, props.r);
      }
      return encodeURIComponent(id);
    },

    /**
     * These methods are called when a pinnable element is detected on the page.
     */
    hazTag: {
      meta: function(tag) {
        if (tag.name.toLowerCase() === 'description') {
          Mavelet.description = tag.content;
        }
      },
      img: function(tag) {
        if (tag.height < Mavelet.config.minImgSize ||
            tag.width < Mavelet.config.minImgSize ||
            /;base64,/g.test(Mavelet.attribute(tag, 'src')) ||
              (tag.height < Mavelet.config.minImgSizeFloor &&
               tag.width < Mavelet.config.minImgSizeFloor)) {
          return;
        }
        Mavelet.thumb({
          _id: Math.floor((Math.random() * 100000) + 1),
          k: Mavelet.config.k,
          domain: window.location.hostname,
          height: tag.height,
          media: 'img',
          selected: false,
          src: Mavelet.attribute(tag, 'src'),
          naturalWidth: tag.naturalWidth,
          naturalHeight: tag.naturalHeight,
          tag,
          title: Mavelet.attribute(tag, 'title') || document.title,
          width: tag.width,
        });
      },
      iframe: function(tag) {
        var id;
        for (var site in Mavelet.config.tag.iframe) {
          for (var j = 0; j < Mavelet.config.tag.iframe[site].match.length; j += 1) {
            if (tag[Mavelet.config.tag.iframe[site].att].match(Mavelet.config.tag.iframe[site]
              .match[j])) {
              id = Mavelet.getId({
                u: tag.src,
              });
              Mavelet.getExtendedInfo({
                site,
                id,
              }, function(info) {
                Mavelet.thumb({
                  k: Mavelet.config.k,
                  height: tag.height,
                  media: 'video',
                  pinurl: info.url,
                  provider: site,
                  selected: false,
                  src: info.thumb,
                  tag,
                  title: info.title || document.title,
                  width: tag.width,
                });
              });
              return;
            }
          }
        }
      },
      title: function(tag) {
        Mavelet.title = Mavelet.attribute(tag, 'src') || document.title;
      }
    },

    /**
     * Callback executed when the pinnable image is loaded to adjust its size.
     */
    imgLoaded(event) {
      event = event || window.event;
      const element = event.target || event.srcElement;
      // Adjusts image size and position.
      if (element.width === element.height) {
        element.width = element.height = Mavelet.config.thumbCellSize;
      }
      if (element.height > element.width) {
        element.width = element.width * (Mavelet.config.thumbCellSize / element.height);
        element.height = Mavelet.config.thumbCellSize;
      }
      if (element.height < element.width) {
        element.height = element.height * (Mavelet.config.thumbCellSize / element.width);
        element.width = Mavelet.config.thumbCellSize;
        element.style.marginTop = 0 - (element.height - Mavelet.config.thumbCellSize) / 2 +
          'px';
      }
      // Shows image.
      document.getElementById(Mavelet.config.k + '_thumb_' + Mavelet.attribute(element, 'src'))
        .className += ' visible';
    },

    /**
     * Searches an element in a array and returns its index.
     *
     * @param  array         Haystack array.
     * @param  searchElement Needle element.
     */
    indexOf(array, searchElement) {
      if (array == null) {
        throw new TypeError();
      }
      const t = Object(array);
      const len = t.length >>> 0;
      if (len === 0) {
        return -1;
      }
      var n = 0;
      if (arguments.length > 0) {
        n = Number(arguments[1]);
        if (n != n) { // shortcut for verifying if it's NaN
          n = 0;
        } else if (n != 0 && n != Infinity && n != -Infinity) {
          n = (n > 0 || -1) * Math.floor(Math.abs(n));
        }
      }
      if (n >= len) {
        return -1;
      }
      var k = n >= 0 ? n : Math.max(len - Math.abs(n), 0);
      for (; k < len; k++) {
        if (k in t && t[k] === searchElement) {
          return k;
        }
      }
      return -1;
    },

    /**
     * Bootstraps the bookmarklet.
     */
    init() {
      // document.head / document.body shim.
      // console.log('running init');
      try {
        document.head = document.head || document.getElementsByTagName('HEAD')[0];
        document.body = document.body || document.getElementsByTagName('BODY')[0];
      } catch (e) {
        // console.log('error accessing head / body');
      }
      // Checks the document is a valid page.
      if (!document.body) {
        Mavelet.close(Mavelet.config.msg.noPinIncompletePage);
        return;
      }
      // Checks bookmarklet is not currently shown.
      if (window.hazPinningNow === true) {
        return;
      }
      window.hazPinningNow = true;
      Mavelet.saveScrollTop = window.pageYOffset;
      // Renders the UI.
      Mavelet.structure(); // loads html
      Mavelet.presentation(); // applies css
      Mavelet.checkPage(); // scrapes the page looking for generic "tags" or known "canoncials"
      if (!Mavelet.hazCanonical && (!Mavelet.hazAtLeastOneGoodThumb || !Mavelet.tag.length)) {
        Mavelet.close(Mavelet.config.msg.notFound);
        return;
      }
      Mavelet.behavior();
    },

    /**
     * Event handler for keydowns.
     */
    keydown(event) {
      // Pressing the Esc key closes the bookmarklet.
      if ((event || window.event).keyCode === 27) {
        Mavelet.close();
      }
    },

    /**
     * Adds a event listener.
     *
     * @param el         Element to attach event to.
     * @param eventType  Event type.
     * @param callback   Event callback.
     */
    listen(element, eventType, callback) {
      // Standard
      if (window.addEventListener) {
        element.addEventListener(eventType, callback, false);
      } else if (window.attachEvent) { // IE
        element.attachEvent('on' + eventType, callback);
      }
    },

    /**
     * Opens the pin popup for a element.
     *
     * @param el  Element to pin.
     */
    pin(args) {
      window.open(Mavelet.config.pin + '?args=' + args, '_blank', Mavelet.config.pop);
      Mavelet.close();
    },

    /**
     * Adds styles to DOM.
     */
    presentation() {
      const style = document.createElement('style');
      Mavelet.attribute(style, 'type', 'text/css');
      Mavelet.attribute(style, 'id', Mavelet.config.k + '_style');
      const template = Mavelet.template(Mavelet.config.templates.styles, {
        k: Mavelet.config.k,
      });
      if (style.styleSheet) {
        style.styleSheet.cssText = template;
      } else {
        style.innerHTML = template;
      }
      if (document.head) {
        document.head.appendChild(style);
      } else {
        Mavelet.doc.main.appendChild(style);
      }
      Mavelet.doc.styl = style;
    },

    /**
     * Adds markup to DOM.
     */
    structure() {
      // Creating a wrapper this way avoids reflow.
      const mainContainer = document.createElement('div');
      Mavelet.attribute(mainContainer, 'id', Mavelet.config.k + '_mainContainer');
      mainContainer.innerHTML = Mavelet.template(Mavelet.config.templates.bookmarkletMarkup, {
        k: Mavelet.config.k
      });
      document.body.appendChild(mainContainer);
      Mavelet.doc.main = mainContainer;
      Mavelet.doc.shim = document.getElementById(Mavelet.config.k + '_shim');
      Mavelet.doc.bg = document.getElementById(Mavelet.config.k + '_bg');
      Mavelet.doc.bd = document.getElementById(Mavelet.config.k + '_bd');
      const height = Mavelet.getHeight();
      if (Mavelet.doc.bd.offsetHeight < height) {
        Mavelet.doc.shim.style.height = height + 'px';
        Mavelet.doc.bd.style.height = height + 'px';
        Mavelet.doc.bg.style.height = height + 'px';
      }
      window.scroll(0, 0);
    },

    /**
     * Renders a template.
     * Uses Tim, a tiny, secure JavaScript micro-templating script.
     * https://github.com/premasagar/tim
     *
     * @param template Template as a string.
     * @param data     Data to replace in the template.
     */
    template: (function () {
      var start = "{{",
        end = "}}",
        path = "[a-z0-9_][\\.a-z0-9_]*", // e.g. config.person.name
        pattern = new RegExp(start + "\\s*(" + path + ")\\s*" + end, "gi"),
        undef;
      return function(template, data) {
        // Merge data into the template string
        return template.replace(pattern, function(tag, token) {
          var path = token.split("."),
            len = path.length,
            lookup = data,
            i = 0;
          for (; i < len; i++) {
            lookup = lookup[path[i]];
            // Property not found
            if (lookup === undef) {
              throw "tim: '" + path[i] + "' not found in " + tag;
            }
            // Return the required value
            if (i === len - 1) {
              return lookup;
            }
          }
        });
      };
    }()),

    /**
     * Adds a element as selectable to pin.
     *
     * @param opts Options for the element.
     */
    thumb(opts) {
      if (!opts.src) {
        return;
      }

      Mavelet.thumbed.forEach(function (thumb) {
        if (thumb.src === opts.src) {
          return;
        }
      });

      // console.log('thumb(): ', opts);

      opts.domain = opts.domain || null;
      opts.specialClass = opts.provider ? '_' + opts.provider : null;
      opts.pinurl = opts.pinurl || null;
      opts.media = opts.media || null;
      document.getElementById(Mavelet.config.k + '_imgContainer').innerHTML += Mavelet.template(
        Mavelet.config.templates.elementMarkup, opts);
      Mavelet.hazAtLeastOneGoodThumb += 1;
      const thumb = {
        _id: opts._id,
        src: opts.src,
        selected: false,
        naturalHeight: opts.naturalHeight,
        naturalWidth: opts.naturalWidth,
      };
      Mavelet.thumbed.push(thumb);
    },

    unlisten(element, eventType, callback) {
      // Standard
      if (window.removeEventListener) {
        element.removeEventListener(eventType, callback, false);
      } else if (window.detachEvent) {
        // IE
        element.detachEvent('on' + eventType, callback)
      }
    },
  };
  Mavelet.init();
}(window, document, {
  k: 'PIN_' + Date.now(),
  api: {
    youtube: 'http://gdata.youtube.com/feeds/api/videos/{{id}}?v=2&alt=json',
  },
  check: ["meta", "iframe", "embed", "object", "img", "video", "title"],
  domain: 'mysite.com',
  minImgSize: 119,
  minImgSizeFloor: 79,
  msg: {
    bustFrame: "We need to remove the StumbleUpon toolbar before you can pin anything. Click OK to do this or Cancel to stay here.",
    cancelTitle: "Cancel Mave-It",
    check: "",
    installed: "The bookmarklet is installed! Now you can click your Mave-It button to grab products as you browse sites around the web.",
    noPin: "This site doesn't allow product scraping to Maven. Please contact the owner with any questions. Thanks for visiting!",
    noPinIncompletePage: "Sorry, can't grab products from non-HTML pages. If you're trying to upload an image, please do-so from mavenxinc.com.",
    notFound: "Sorry, couldn't find any products on this page.",
    privateDomain: "%privateDomain% doesn't allow product scraping to Maven. Please contact the owner with any questions."
  },
  pin: window.mavenHost + 'mavelet',
  pop: 'status=no,resizable=yes,scrollbars=yes,personalbar=no,directories=no,location=no,toolbar=no,menubar=no,width=886,height='+screen.height*.8+',left=0,top=0',
  seek: {
    youtube: {
      media: 'video',
      tagName: 'meta',
      property: 'property',
      content: 'content',
      field: {
        'og:title': 'pTitle',
        'og:url': 'pUrl',
        'og:image': 'pImg',
        'og:video:width': 'pWidth',
        'og:video:height': 'pHeight',
      },
    },
  },
  templates: {
    styles: [
      '#{{k}}_bg { z-index:2147483641; position: fixed; top: 0px; left: 0px; right: 0px; bottom: 0px; height: 100%; width: 100%; background: #6563a4; opacity: 0.95; }',
      '#{{k}}_shim { z-index:2147483640; position: absolute; background: transparent; top:0; right:0; bottom:0; left:0; width: 100%; border: 0; }',
      '#{{k}}_bd { z-index:2147483642; position: absolute; text-align: center; width: 100%; top: 0; left: 0; right: 0; font:16px hevetica neue, arial, san-serif; background: width: 100%; bottom: 9px; }',
      '#{{k}}_bd #{{k}}_hd { z-index:2147483646; position: relative; width:100%; top: 0; left: 0; right: 0; height: 75px; line-height: 75px; font-size: 14px; font-weight: bold; display: block; margin: 0; background: #ffffff; border-bottom: 1px solid #aaa; display: -webkit-box; display: -webkit-flex; display: -ms-flexbox; display: flex; -webkit-box-orient: horizontal; -webkit-box-direction: normal; -webkit-flex-direction: row; -ms-flex-direction: row; flex-direction: row; -webkit-align-content: center; -ms-flex-line-pack: center; align-content: center; -webkit-box-align: center; -webkit-align-items: center; -ms-flex-align: center; align-items: center; -webkit-box-pack: center; -webkit-justify-content: center; -ms-flex-pack: center; justify-content: center;}',
      '#{{k}}_bd #{{k}}_hd a#{{k}}_x { display: inline-block; cursor: pointer; color: #524D4D; line-height: 50px; text-shadow: 0 1px #fff; float: right; text-align: center; width: 100px; border-left: 1px solid #aaa; text-decoration: none; line-height: 50px; width: 150px; height: 50px; border: 1px solid #ddd; border-radius: 3px; margin-right: 10px;}',
      '#{{k}}_bd #{{k}}_hd a#{{k}}_x:hover { color: #6563a4; background: #fff; text-decoration: none; }',
      '#{{k}}_bd #{{k}}_hd a#{{k}}_x:active { color: #fff; background: #6563a4; text-decoration: none; text-shadow:none;}',
      '#{{k}}_bd #{{k}}_hd a#{{k}}_submit { display: inline-block; cursor: pointer; color: #524D4D; line-height: 50px; float: right; text-align: center; width: 100px; border-left: 1px solid #aaa; background-color: #6563a4; color: #fff; text-decoration: none; line-height: 50px; height: 50px; width: 150px; border-radius: 3px; margin-right: 10px;}',
      '#{{k}}_bd #{{k}}_hd a#{{k}}_submit:hover { color: #fff; background: rgba(101, 99, 164, 0.8); text-decoration: none; }',
      '#{{k}}_bd #{{k}}_hd a#{{k}}_submit:active { color: #fff; background: #6563a4; text-decoration: none; text-shadow:none;}',
      '#{{k}}_bd #{{k}}_hd #{{k}}_logo {height: 30px; width: 250px;  background: transparent url(https://www.mavenx.com/img/maven/maven_logo.svg) no-repeat; border: none;left: 10px; position: absolute; top: 25px; background-size: contain; background-position: left center;}',
      '#{{k}}_instructions { display: inline-block; cursor: pointer; color: white; vertical-align: middle; z-index:2147483648; *position:absolute; width:100%; top: 0; left: 0; right: 0; height: 30px; line-height: 30px; font-size: 30px; font-weight: bold; margin: 30px 0; }',
      '#{{k}}_bd #{{k}}_spacer { display: none; height: 0; }',
      '#{{k}}_bd #{{k}}_spacer2 { display: block; height: 10px; }',
      '#{{k}}_imgContainer { display: -webkit-box; display: -webkit-flex; display: -ms-flexbox; display: flex; -webkit-box-orient: horizontal; -webkit-box-direction: normal; -webkit-flex-direction: row; -ms-flex-direction: row; flex-direction: row; -webkit-flex-wrap: wrap; -ms-flex-wrap: wrap; flex-wrap: wrap; -webkit-flex-wrap: wrap; -ms-flex-wrap: wrap; flex-wrap: wrap; -webkit-align-content: center; -ms-flex-line-pack: center; align-content: center; -webkit-box-pack: start; -webkit-justify-content: flex-start; -ms-flex-pack: start; justify-content: flex-start; -webkit-box-align: center; -webkit-align-items: center; -ms-flex-align: center; align-items: center; padding: 0 10%;}',
      '#{{k}}_bd span.{{k}}_pinContainer { height:200px; width:200px; border-radius: 3px; display: -webkit-box; display: -webkit-flex; display: -ms-flexbox; display: flex; -webkit-box-orient: vertical; -webkit-box-direction: normal; -webkit-flex-direction: column; -ms-flex-direction: column; flex-direction: column; margin: 10px; background:#fff; position:relative; box-shadow: 0 0  2px #555; margin: 10px; }',
      '#{{k}}_bd span.{{k}}_pinContainer.visible { position:relative; visibility:visible }',
      '#{{k}}_bd span.{{k}}_pinContainer { zoom:1; *border: 1px solid #aaa; }',
      '#{{k}}_bd span.{{k}}_pinContainer img { margin:0; padding:5px; border:none;}',
      '#{{k}}_bd span.{{k}}_pinContainer span.img, #{{k}}_bd span.{{k}}_pinContainer span.{{k}}_play { position: absolute; top: 0; left: 0; height:200px; width:200px; overflow:hidden; }',
      '#{{k}}_bd span.{{k}}_pinContainer cite {position: absolute; bottom: 0px; left:0; width: 100%;}',
      '#{{k}}_bd span.{{k}}_pinContainer cite span { position: absolute; bottom: 0; left: 0; right: 0; width: 200px; border-radius: 3px; color: #000; height: 22px; line-height: 24px; font-size: 10px; font-style: normal; text-align: center; position: absolute; left: 0; width: 100%; height: 20px; background: rgba(221,221,221,0.9);}',
      '#{{k}}_bd span.{{k}}_pinContainer cite span.{{k}}_mask { background:#eee; opacity:.75; *filter:alpha(opacity=75); }',
      '#{{k}}_bd span.{{k}}_pinContainer cite span.{{k}}_title input {width: 15px; height: 15px; z-index: 99999999999;}',
      '#{{k}}_bd span.{{k}}_pinContainer input { z-index:2147483645; -webkit-appearance: checkbox; border-radius: initial; }',
      '#{{k}}_bd span.{{k}}_pinContainer label { z-index:2147483644; display:block; position:relative; margin:20px; padding: 15px 30px 15px 62px; border: 3px solid #fff; border-radius:100px; color:#fff; background-color: #6a8494; box-shadow: 0 0 20px rgba(0, 0, 0, .2); white-space: nowrap; cursor: pointer; -webkit-user-select: none; -moz-user-select: none; -ms-user-select: none; user-select: none; -webkit-transition:background-color .2s, box-shadow .2s; transition: background-color .2s, box-shadow .2s; }',
      '#{{k}}_bd span.{{k}}_pinContainer label::before { content: ""; display: block; position: absolute;top: 10px;bottom: 10px;left: 10px;width: 32px;border: 3px solid #fff;border-radius: 100px;-webkit-transition: background-color .2s;transition: background-color .2s; }',
      '#{{k}}_bd span.{{k}}_pinContainer label:first-of-type { -webkit-transform: translateX(-40px);transform: translateX(-40px); }',
      '#{{k}}_bd span.{{k}}_pinContainer label:last-of-type { -webkit-transform: translateX(40px);transform: translateX(40px); }',
      '#{{k}}_bd span.{{k}}_pinContainer label:hover { box-shadow: 0 0 20px rgba(0, 0, 0, .6); }',
      '#{{k}}_bd span.{{k}}_pinContainer input:focus + label { box-shadow: 0 0 20px rgba(0, 0, 0, .6); }',
      '#{{k}}_bd span.{{k}}_pinContainer input:checked + label { background-color: #ab576c; }',
      '#{{k}}_bd span.{{k}}_pinContainer input:checked + label::before { background-color: #fff; }',
      '*, *::before, *::after  {box-sizing: border-box; }',
      '.cite {position: absolute; bottom: 0px; left: 0px; width: 100%; height: 20px; background: rgba(221, 221, 221, 0.9) none repeat scroll 0% 0%;}',
    ].join(''),
    bookmarkletMarkup: [
      '<iframe width="100%" height="100%" id="{{k}}_shim" nopin="nopin"></iframe>',
      '<div id="{{k}}_bg"></div>', '<div id="{{k}}_bd">', '<div id="{{k}}_spacer"></div>',
      '<div id="{{k}}_hd">', '<a id="{{k}}_x">Cancel</a>', '<a id="{{k}}_submit">Next</a>',
      '<span id="{{k}}_logo"></span>', '</div>', '<div id="{{k}}_spacer2"></div>',
      '<span id="{{k}}_instructions">Click on images to add/remove for your product clipping.</span>',
      '<span id="{{k}}_embedContainer"></span>', '<span id="{{k}}_imgContainer"></span>',
      '</div>'
    ].join(''),
    elementMarkup: [
      '<span _id="{{_id}}" class="{{k}}_pinContainer" id="{{k}}_thumb_{{src}}" domain="{{domain}}">',
        '<span _id="{{_id}}" class="img">',
          '<img _id="{{_id}}" nopin="nopin" src="{{src}}" onload="window.{{k}}.imgLoaded(event)">',
        '</span>',
        '<cite _id="{{_id}}">',
          '<span _id="{{_id}}" class="{{k}}_mask"></span>',
          '<span _id="{{_id}}" class="{{k}}_title">',
            '<input _id="{{_id}}" id="{{k}}_selected_{{src}}" style="visibility:visible;" type="checkbox">',
          '</span>',
        '</cite>',
        '<a _id="{{_id}}" class="{{k}}_pinThis" rel="{{media}}" href="#" pindesc="{{title}}" pinimg="{{src}}" pinurl="{{pinurl}}"></a>',
      '</span>',
    ].join(''),
  },
  tag: {
    embed: {
      youtube: {
        att: 'src',
        match: [/^http:\/\/s\.ytimg\.com\/yt/, /^http:\/\/.*?\.?youtube-nocookie\.com\/v/],
      },
    },
    iframe: {
      youtube: {
        att: 'src',
        match: [/^http:\/\/www\.youtube\.com\/embed\/([a-zA-Z0-9\-_]+)/],
      },
      vimeo: {
        att: 'src',
        match: [/^http?s:\/\/vimeo.com\/(\d+)/, /^http:\/\/player\.vimeo\.com\/video\/(\d+)/],
      },
    },
    object: {
      youtube: {
        att: 'data',
        match: [/^http:\/\/.*?\.?youtube-nocookie\.com\/v/],
      },
    },
    video: {
      youtube: {
        att: 'src',
        match: [/videoplayback/],
      },
    },
  },
  thumbCellSize: 200,
  url: {
    facebook: /^https?:\/\/.*?\.?facebook\.com\//,
    googleReader: /^https?:\/\/.*?\.?google\.com\/reader\//,
    own: /^https?:\/\/(www\.)?mysite\.com\//,
    pinterest: /^https?:\/\/.*?\.?pinterest\.com\//,
    stumbleUpon: /^https?:\/\/.*?\.?stumbleupon\.com\//,
    vimeo: /^https?:\/\/.*?\.?vimeo\.com\//,
    youtube: /^https?:\/\/www\.youtube\.com\/watch\?/,
  },
}));
