import { ReactiveVar } from 'meteor/reactive-var';
import $ from 'jquery';
import _ from 'lodash';

const ScrollTop = new ReactiveVar(0);

let handleScroll = () => {
  ScrollTop.set($(window).scrollTop());
};

// Don't call it too often
handleScroll = _.throttle(handleScroll, 200);

window.addEventListener('scroll', handleScroll);

export default (props, onData) => {
  onData(null, {
    scrollTop: ScrollTop.get(),
  });
};

