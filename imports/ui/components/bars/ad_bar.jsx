import React, { PropTypes, Component } from 'react';
import { Meteor } from 'meteor/meteor';
import { FlowRouter } from 'meteor/kadira:flow-router';
import Img from '/imports/ui/components/img.jsx';
import { composeWithTracker } from 'react-komposer';
import { StyleSheet, css } from 'aphrodite';

import { resetHeight } from '../../layouts/hide_on_scroll';

const styles = StyleSheet.create({
  bar: {
    display: 'flex',
    justifyContent: 'center',
    paddingBottom: '0.5px',
  },
});

const track = (adId, requestId, type) => {
  Meteor.call('ads.recordImpression', adId, requestId, type);
};

class AdBar extends Component {
  componentDidUpdate() {
    resetHeight();
  }

  render() {
    const { adId, requestId, src, url, alt, height, width, loading } = this.props;
    return (src || loading) ?
      <div className={`navbar-bg ${css(styles.bar)}`}>
        <a
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          style={{ height: `${height}px` }}
        >
          <Img
            onClick={() => {
              track(adId, requestId, 'click');
            }}
            src={src}
            alt={alt}
            height={height}
            width={width}
          />
        </a>
      </div> : <span />;
  }
}

// src="/img/mcdonalds728x90example.jpg"
export default composeWithTracker((props, onData) => {
  const adUnit = FlowRouter.current().queryParams.category || props.defaultAdUnit;
  const size = {};
  if (screen.width > 728) {
    size.width = 728;
    size.height = 90;
  } else {
    size.width = 320;
    size.height = 50;
  }
  onData(null, { ...size, loading: true });
  Meteor.call('ads.getAd', adUnit, size, (err, resp) => {
    if (resp) {
      onData(null, Object.assign({}, resp, size));
      track(resp.adId, resp.requestId, 'fetch');
    } else {
      onData(null, { loading: false });
    }
  });
})(AdBar);
