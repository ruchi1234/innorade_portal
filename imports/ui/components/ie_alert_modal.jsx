import React from 'react';
import Modal from '/imports/ui/components/modal/modal';
import ModalBody from '/imports/ui/components/modal/modal_body';
import ModalHeader from '/imports/ui/components/modal/modal_header';
import PageMessage from '/imports/ui/components/page_message';

let shown = false;

export default class LoginModal extends React.Component {
  componentDidMount() {
    if (!shown && this.isIE()) {
      shown = true;
      this.refs.modal.show();
    }
  }

  isIE() {
    // Snippet from https://stackoverflow.com/questions/33152523/how-do-i-detect-ie-and-edge-browser
    return document.documentMode || /Edge/.test(navigator.userAgent);
  }

  render() {
    return (
      <Modal ref="modal">
        <ModalHeader />
        <ModalBody>
          <PageMessage>
            <p>
              Thank you for visiting Maven.
            </p>
            <p>
              Maven Xchange is optimized for Chrome and Safari.
              You're using Internet Explorer, which is not yet supported.
              Please use Chrome or Safari for the best experience.
            </p>
          </PageMessage>
        </ModalBody>
      </Modal>
    );
  }
}

