import React from 'react';
import ReactDOM from 'react-dom';
import { _ } from 'meteor/underscore';
import { composeWithTracker } from 'react-komposer';

import data from '/imports/data/contacts/by_user';
import ContactSelect from './inputs/contact_select';
import EmailInput from './inputs/email_input';
import SendEmailUserTag from '/imports/ui/components/share/by_email/user_tag';
import OrSeparator from '/imports/ui/components/or';
import Row from '/imports/ui/components/grid/row';
import Col from '/imports/ui/components/grid/col';

let HideNoContacts = ({ contacts, contactEmails, children }) => (
  (contacts.length > 0 || contactEmails.length > 0) ?
    children :
    <span></span>
);

HideNoContacts.propTypes = {
  contacts: React.PropTypes.array.isRequired,
  contactEmails: React.PropTypes.array.isRequired,
  children: React.PropTypes.node.isRequired,
};

HideNoContacts = composeWithTracker(data)(HideNoContacts);

class ShareEmailForm extends React.Component {
  constructor() {
    super();

    this.state = {
      sendToUsers: [],
      errors: {},
    };

    this.addEmail = this.addEmail.bind(this);
    this.addContact = this.addContact.bind(this);
  }

  validate(cb) {
    this.refs.addEmailInput.handleAddEmail();

    this.forceUpdate(() => {
      const errors = {};
      if (!this.state.sendToUsers.length) {
        errors.sendToUsers = 'At least one user to send to is required';
      }
      this.setState({ errors }, cb);
    });
  }

  isValid(cb) {
    this.validate(() => {
      cb(_.keys(this.state.errors).length === 0);
    });
  }

  value() {
    const { sendToUsers } = this.state;
    const emails = [];
    const contactIds = [];
    sendToUsers.forEach((u) => {
      if (u.email) {
        emails.push(u.email);
      } else {
        contactIds.push(u.contact.contactId);
      }
    });

    return {
      emails,
      contactIds,
      notes: ReactDOM.findDOMNode(this.refs.notesInput).value,
    };
  }

  addEmail(email) {
    const sendToUsers = this.state.sendToUsers.slice(0);
    if (!_.find(sendToUsers, (u) => u.email === email)) {
      sendToUsers.push({ email });
      this.setState({ sendToUsers });
    }
  }

  addContact(contact) {
    const sendToUsers = this.state.sendToUsers.slice(0);
    sendToUsers.push({ contact });
    this.setState({ sendToUsers });
  }

  reset() {
    this.setState({ sendToUsers: [] });
  }

  render() {
    const { typeLabel, defaultNotes } = this.props;
    const { sendToUsers } = this.state;

    return (
      <section className="send-email-form">
        <h4>Send an Email</h4>

        <section>
          <EmailInput
            addEmail={this.addEmail}
            ref="addEmailInput"
          />
        </section>

        <HideNoContacts>
          <section className="or">
            <Row>
              <Col sm={12} md={8} mdOffset={2} lg={6} lgOffset={3}>
                <OrSeparator />
              </Col>
            </Row>
          </section>
        </HideNoContacts>

        <HideNoContacts>
          <ContactSelect
            excludedContactIds={sendToUsers.map((u) => u.contact && u.contact.contactId)}
            excludedContactEmails={sendToUsers.map((u) => u.email)}
            addContact={this.addContact}
            addEmail={this.addEmail}
          />
        </HideNoContacts>

        <br />
        <br />
        <hr />

        <section>
          <label>
            Send Email To:
          </label>
          <div>
            {sendToUsers.map((user) => {
              const removeUser = () => {
                const stu = sendToUsers.filter((u) => u !== user);
                this.setState({ sendToUsers: stu });
              };

              let label;
              let imageSrc;
              let key;
              if (user.contact) {
                key = user.contact._id;

                const c = user.contact.getContact();
                label = c.fullLabel();
                imageSrc = c.getImage();
              } else {
                label = user.email;
                key = user.email;
              }

              return (<SendEmailUserTag
                label={label}
                imageSrc={imageSrc}
                key={key}
                onSelected={removeUser}
              />);
            })}
            {sendToUsers.length > 0 &&
              <span className="text-muted">
                (Tap to remove)
              </span>
            }
          </div>
        </section>

        <section>
          <label>
            Note:
          </label>

          <textarea
            ref="notesInput"
            defaultValue={defaultNotes}
          />
        </section>
      </section>
    );
  }
}

export default ShareEmailForm;
