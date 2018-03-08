/* global utu */
import React from 'react';
import mixpanel from 'mixpanel-browser';
import Img from '/imports/ui/components/img';
import Modal from '/imports/ui/components/modal/modal';
import ModalBody from '/imports/ui/components/modal/modal_body';
import ModalHeader from '/imports/ui/components/modal/modal_header';
import ModalFooter from '/imports/ui/components/modal/modal_footer';
import ModalActions from '/imports/ui/components/modal/modal_actions';
import { showLogin } from '/imports/ui/layouts/base_layout';

const BrowseOrSignup = ({ handleHide }) => (
  <div className="actions">
    <button
      className="btn btn-custom"
      onClick={handleHide}
    >BROWSE
    </button>
    <button
      className="btn btn-custom"
      onClick={() => {
        handleHide();
        showLogin('', false, true);
      }}
    >SIGNUP
    </button>
  </div>
);

BrowseOrSignup.propTypes = {
  handleHide: React.PropTypes.func.isRequired,
};

class NewUserSplashModal extends React.Component {
  constructor() {
    super();

    this.state = {
      showVideo: false,
    };
  }

  componentDidMount() {
    if (mixpanel.get_property('showSplash')) {
      this.refs.newUserSplashModalHTML.show();
      mixpanel.register({ showSplash: 0 });  // 0 hides the modal
      mixpanel.track('Welcome Modal');
      utu.track('Welcome Modal');
    }
  }

  newUserSplashVideoHTML() {
    return (
      <section className={`modal-body-inner info-modals ${!this.state.showVideo && 'hidden'}`}>
        <iframe
          width={'100%'}
          height={'365px'}
          src="https://www.youtube.com/embed/g7ve2onONMM"
          frameBorder="0"
          allowFullScreen
        />
        <BrowseOrSignup
          handleHide={() => this.refs.newUserSplashModalHTML.hide()}
        />
      </section>
    );
  }

  newUserSplashWelcomeHTML() {
    return (
      <section className={`modal-body-inner info-modals ${this.state.showVideo && 'hidden'}`}>
        <div className="brand-container">
          <a href="/">
            <Img
              className="brand"
              src="/img/maven/maven_logo.svg"
              alt="Maven logo"
            />
          </a>
        </div>
        <h2 className="welcome">
          Welcome!
        </h2>
        <p>
          At Maven, you can browse great product collections created by experts.
          Or, you can <b>EARN</b> by recommending products you love to others.
        </p>
        <BrowseOrSignup
          handleHide={() => this.refs.newUserSplashModalHTML.hide()}
        />
        <br></br>
        <div className="clip-share-earn">
          <p>
            Earning is as easy as:
          </p>
          <div className="clip">
            <h2 className="number">1</h2>
            <h2 className="large-label">Clip</h2>
            <p>
              Design your own collections by clipping products from ~3,000
              in-network merchants.
            </p>
          </div>
          <div className="share">
            <h2 className="number">
              2
            </h2>
            <h2 className="large-label">
              Share
            </h2>
            <p>
              Share your collections using email, Pinterest, Twitter, Facebook
              or by publishing on MavenX.com.
            </p>
          </div>
          <div className="earn">
            <h2 className="number">3</h2>
            <h2 className="large-label">Earn</h2>
            <p>
              Earn when someone clicks and buys based on your boards or product
              recommendations.
            </p>
          </div>
        </div>
        <br></br>
        <Img
          className="img-responsive vid-img"
          src="/img/ui/maven_video.png"
          role="presentation"
          onClick={() => {
            this.setState({ showVideo: true });
            mixpanel.track('Welcome Video');
            utu.track('Welcome Video');
          }}
        />
        <p>See what Maven is all about in this short video.</p>
      </section>
    );
  }

  render() {
    return (
      <Modal className="newUserSplashModalHTML" ref="newUserSplashModalHTML">
        <ModalHeader className="text-center">
          <h2>Clip Earn Share</h2>
        </ModalHeader>
        <ModalBody className="new-user-modal-content">
          {!this.state.showVideo &&
              this.newUserSplashWelcomeHTML() ||
              this.newUserSplashVideoHTML()
          }
          <section className="new-user-modal-info">
            <p>
              Everyone is an expert at something!  With Maven, you have an
              opportunity to earn from it.
            </p>
            <h3>
              Clip. Share. Earn.
            </h3>
          </section>
        </ModalBody>
        <ModalFooter>
          <ModalActions
            actions={[{
              label: 'Close',
              action: () => this.refs.newUserSplashModalHTML.hide(),
            }]}
          />
        </ModalFooter>
      </Modal>
    );
  }
}

export default NewUserSplashModal;
