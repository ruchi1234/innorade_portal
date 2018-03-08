import React from 'react';
import { composeAll, composeWithTracker } from 'react-komposer';
import TranslateY from '/imports/ui/translate_y';

// import Container from '/imports/ui/components/grid/container';
import loginData from '/imports/data/users/login_state';
import scrollTopData from '/imports/data/misc/scroll_top';

const HiddenStyle = TranslateY('100');

class VisitorFooter extends React.Component {
  // Implementing this is the only reason this isn't
  // a () => {} component
  // We can eliminate alot of work by only re-rendering when needed
  shouldComponentUpdate(nextProps) {
    // if login state changed, re-render
    if (nextProps.loggedIn !== this.props.loggedIn) {
      return true;
    }

    // If at scrollTop 0, previously but not currently
    // or vice versa, re-render.  Otherwise don't
    return (
      (nextProps.scrollTop === 0 && this.props.scrollTop !== 0) ||
        (nextProps.scrollTop !== 0 && this.props.scrollTop === 0)
    );
  }

  render() {
    const { loggedIn, scrollTop } = this.props;
    const hidden = (loggedIn || scrollTop > 0);
    return (
      <nav
        className="visitor-footer navbar navbar-default navbar-fixed-bottom"
        style={hidden ? HiddenStyle : {}}
      >
        <ul className="nav navbar-nav">
          <li>
            <a href="http://about.mavenx.com/privacy-policy/" target="_blank">
              Privacy
            </a>
          </li>
          <li>|</li>
          <li>
            <a href="http://about.mavenx.com/terms-of-service/" target="_blank">
              Terms of Service
            </a>
          </li>
        </ul>
        <ul className="nav navbar-nav copyright">
          <li><a>© 2016 Maven Exchange, Inc.</a></li>
        </ul>
      </nav>
    );
  }
}

VisitorFooter.propTypes = {
  loggedIn: React.PropTypes.bool.isRequired,
  scrollTop: React.PropTypes.number.isRequired,
};

const VisitorFooterWData = composeAll(
  composeWithTracker(scrollTopData),
  composeWithTracker(loginData)
)(VisitorFooter);

export default VisitorFooterWData;
export { VisitorFooter as Component };
