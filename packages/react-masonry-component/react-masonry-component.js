import Masonry from 'masonry-layout';
var isBrowser = Meteor.isClient;
var React = require('react');
var ReactDOM = require('react-dom');
import shallowCompare from 'react-addons-shallow-compare';
var refName = 'masonryContainer';

function extend() {
  var result = {};
  for (var i = 0; i < arguments.length; i++) {
    var keys = Object.keys(arguments[i]);
    for (var j = 0; j < keys.length; j++) {
      result[keys[j]] = arguments[i][keys[j]];
    }
  }
  return result;
}


const ReactMasonryComponent = React.createClass({
  masonry: false,

  domChildren: [],

  displayName: 'MasonryComponent',

  propTypes: {
    disableImagesLoaded: React.PropTypes.bool,
    options: React.PropTypes.object
  },

  getDefaultProps: function() {
    return {
      disableImagesLoaded: false,
      options: {},
      className: '',
      elementType: 'div',
    };
  },

  componentDidMount() {
    this._timers = [];
    this.performLayout = _.throttle(this.performLayout, 100);
    this.initializeMasonry();
    this.imagesLoaded();
  },

  shouldComponentUpdate(nextProps, nextState) {
    return shallowCompare(this, nextProps, nextState);
  },

  initializeMasonry: function(force) {
    if (!this.masonry || force) {
      this.masonry = new Masonry(
        this.refs[refName],
        this.props.options
      );

      this.masonry.layout = _.throttle(this.masonry.layout, 100);

      this.domChildren = this.getNewDomChildren();
    }
  },

  getNewDomChildren: function() {
    var node = this.refs[refName];
    if (node && node.querySelectorAll) {
      var children = this.props.options.itemSelector ? node.querySelectorAll(this.props.options.itemSelector) : node.children;
      return Array.prototype.slice.call(children);
    }
    return [];
  },

  diffDomChildren: function() {
    var oldChildren = this.domChildren.filter(function(element) {
      /*
       * take only elements attached to DOM
       * (aka the parent is the masonry container, not null)
       */
      return !!element.parentNode;
    });

    var newChildren = this.getNewDomChildren();

    var removed = oldChildren.filter(function(oldChild) {
      return !~newChildren.indexOf(oldChild);
    });

    var domDiff = newChildren.filter(function(newChild) {
      return !~oldChildren.indexOf(newChild);
    });

    var beginningIndex = 0;

    // get everything added to the beginning of the DOMNode list
    var prepended = domDiff.filter(function(newChild, i) {
      var prepend = (beginningIndex === newChildren.indexOf(newChild));

      if (prepend) {
        // increase the index
        beginningIndex++;
      }

      return prepend;
    });

    // we assume that everything else is appended
    var appended = domDiff.filter(function(el) {
      return prepended.indexOf(el) === -1;
    });

    /*
     * otherwise we reverse it because so we're going through the list picking off the items that
     * have been added at the end of the list. this complex logic is preserved in case it needs to be
     * invoked
     *
     * var endingIndex = newChildren.length - 1;
     *
     * domDiff.reverse().filter(function(newChild, i){
     *     var append = endingIndex == newChildren.indexOf(newChild);
     *
     *     if (append) {
     *         endingIndex--;
     *     }
     *
     *     return append;
     * });
     */

    // get everything added to the end of the DOMNode list
    var moved = [];

    if (removed.length === 0) {
      moved = oldChildren.filter(function(child, index) {
        return index !== newChildren.indexOf(child);
      });
    }

    this.domChildren = newChildren;

    return {
      old: oldChildren,
      new: newChildren,
      removed: removed,
      appended: appended,
      prepended: prepended,
      moved: moved
    };
  },

  reloadItems() {
    this._timer = setTimeout(function() {
      this.masonry.reloadItems();
      this.isMounted && this.isMounted() && this.forceUpdate()
    }.bind(this), 0);
  },

  performLayout: function(dontRerun) {
    var diff = this.diffDomChildren();

    if (diff.removed.length > 0) {
      this.masonry.remove(diff.removed);
      this.masonry.reloadItems();
    }

    if (diff.appended.length > 0) {
      this.masonry.appended(diff.appended);
      this.masonry.reloadItems();
    }

    if (diff.prepended.length > 0) {
      this.masonry.prepended(diff.prepended);
    }

    if (diff.moved.length > 0 || diff.prepended.length > 0 || diff.appended.length > 0 || diff.removed.length > 0) {
      this.masonry.reloadItems();
    }

    this.masonry.layout();


    if (!dontRerun) {
      // This library is butchered and a half.
      // No clue why the hell the relayout isn't working
      // after image loads.  May not even be related to images.
      this._timers.push(Meteor.setTimeout(() => {
        this.performLayout(true);
      }, 200));
      this._timers.push(Meteor.setTimeout(() => {
        this.performLayout(true);
      }, 400));
      this._timers.push(Meteor.setTimeout(() => {
        this.performLayout(true);
      }, 1000));
      this._timers.push(Meteor.setTimeout(() => {
        this.performLayout(true);
      }, 5000));
    }
  },

  imagesLoaded: function() {
    if (this.props.disableImagesLoaded) return;
    $(ReactDOM.findDOMNode(this)).imagesLoaded(
      this.refs[refName],
      function(instance) {
        this.performLayout();
      }.bind(this)
    );
  },

  componentDidUpdate() {
    this.performLayout();
  },

  componentWillUnmount: function() {
    _.each(this._timers,(t) => {
      clearTimeout(t);
    });
    clearTimeout(this._timer);
  },

  render: function() {
    return React.createElement(this.props.elementType, _.omit(extend(this.props, { ref: refName }), 'disableImagesLoaded', 'elementType', 'options'), this.props.children);
  }
});

export default ReactMasonryComponent;
