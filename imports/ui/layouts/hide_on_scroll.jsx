import React from 'react';
import ReactDOM from 'react-dom';
import shallowCompare from 'react-addons-shallow-compare';
import TranslateY from '/imports/ui/translate_y';

/*
 * This component takes children, displays them fixed
 * hides them when scrolling, as well
 * as handling a relative position placeholder for the child
 * elements
 */

// Determines sensetivity of component
const DELTA = 5;
const HiddenStyle = TranslateY('-100');

let resetHeight;

const HideOnScroll = new React.createClass({
  displayName: 'hideOnScroll',

  propTypes: {
    children: React.PropTypes.node.isRequired,
  },

  getInitialState() {
    return {
      hidden: false,
    };
  },

  componentWillMount() {
    resetHeight = () => this.resetHeight();
    this.handleScroll = _.throttle(this.handleScroll, 200);
    window.addEventListener('scroll', this.handleScroll);
  },

  componentDidMount() {
    this.resetHeight();

    this.onResize = _.throttle(this.onResize, 200);
    window.addEventListener('resize', this.onResize);
  },

  shouldComponentUpdate(nextProps, nextState) {
    return shallowCompare(this, nextProps, nextState);
  },

  componentDidUpdate() {
    this.resetHeight();
  },

  componentWillUnmount() {
    window.removeEventListener('scroll', this.handleScroll);
    window.removeEventListener('resize', this.onResize);
  },

  onResize() {
    this.resetHeight();
  },

  resetHeight() {
    const height = ReactDOM.findDOMNode(this.refs.hiddenChildren).offsetHeight;
    this.setState({ height });
  },

  handleScroll() {
    const { height } = this.state;

    const prevScrollTop = this.scrollTop;
    this.scrollTop = $(window).scrollTop();

    const dScrollTop = prevScrollTop - this.scrollTop;

    if (Math.abs(dScrollTop) <= DELTA) { return; }

    // If scrolling down and further down the page
    // than the children height, move hide children
    if (dScrollTop < 0 && this.scrollTop > height) {
      this.setState({ hidden: true });
    } else {
      this.setState({ hidden: false });
    }
  },

  render() {
    const { hidden, height } = this.state;

    return (
      <div className="hide-on-scroll" style={{ height }}>
        <div
          key="children"
          ref="hiddenChildren"
          className="hideable"
          style={hidden ? HiddenStyle : {}}
        >
          {this.props.children}
        </div>
      </div>
    );
  },
});

export default HideOnScroll;
export { resetHeight };
