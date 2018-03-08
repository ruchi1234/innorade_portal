import React from 'react';
import Modal from '/imports/ui/components/modal/modal';
import ModalHeader from '/imports/ui/components/modal/modal_header';
import ModalBody from '/imports/ui/components/modal/modal_body';
import DoneFooter from '/imports/ui/components/modal/done_footer';
import SendFooter from '/imports/ui/components/modal/send_footer';
import ShareEmailForm from '/imports/ui/components/share/by_email/form';
import ModalFooter from '/imports/ui/components/modal/modal_footer';
import canHof from '/imports/modules/can/can_hof';

const shareModalHOC = ({ Confirmation, defaultNotes, handleSend }) =>
  class shareModal extends React.Component {
    constructor() {
      super();
      this.state = { sent: false };

      this.sendInvite = this.sendInvite.bind(this);
      this.hide = this.hide.bind(this);
      this.show = canHof({
        handleAction: this.show.bind(this),
        requireVerified: true,
      });
    }

    show() {
      this.setState({ sent: false });
      if (this.refs.form) {
        this.refs.form.reset();
      }
      this.refs.modal.show();
    }

    hide() {
      this.refs.modal.hide();
    }

    sendInvite() {
      this.refs.form.isValid((valid) => {
        if (valid) {
          const value = this.refs.form.value();
          handleSend(value, this.props);
          this.setState({ sent: true });
        }
      });
    }

    renderFooter() {
      const { sent } = this.state;
      return (
        !sent ?
          <SendFooter onSend={this.sendInvite} onCancel={this.hide} /> :
          <DoneFooter onDone={this.hide} />
      );
    }

    render() {
      const { sent } = this.state;

      return (
        <Modal ref="modal">
          <ModalHeader />
          <ModalBody>
            {!sent ?
              <ShareEmailForm
                ref="form"
                defaultNotes={defaultNotes}
              /> :
              <Confirmation />
            }
          </ModalBody>
          <ModalFooter>
            {
              this.renderFooter(sent)
            }
          </ModalFooter>
        </Modal>
      );
    }
  };

export default shareModalHOC;
