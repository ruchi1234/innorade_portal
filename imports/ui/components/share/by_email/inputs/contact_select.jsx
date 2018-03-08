import React from 'react';
import { composeWithTracker } from 'react-komposer';

import data from '/imports/data/contacts/by_user';
import SendEmailUserTag from '/imports/ui/components/share/by_email/user_tag';

const ContactTag = ({ contact, onSelected }) => {
  // Contact records have a contact field that is mostly
  // what we really want
  const c = contact.getContact();
  return (<SendEmailUserTag
    label={c.fullLabel()}
    imageSrc={c.getImage()}
    onSelected={onSelected}
  />);
};

ContactTag.propTypes = {
  contact: React.PropTypes.object.isRequired,
  onSelected: React.PropTypes.func.isRequired,
};

const ContactEmailTag = ({ contact, onSelected }) => (
  <SendEmailUserTag
    label={contact.email}
    onSelected={onSelected}
  />
);

ContactEmailTag.propTypes = {
  contact: React.PropTypes.object.isRequired,
  onSelected: React.PropTypes.func.isRequired,
};

const Component = ({ addContact, addEmail, contacts, contactEmails }) =>
  <section className="contact-select">
    <div className="my-contacts-select">
      <label>
        My Contacts&nbsp;&nbsp;
        <span className="text-muted">
          (Tap to select)
        </span>
      </label>

      <div className="form-control">
        {contacts.map((contact) => {
          const addToSendTo = () => {
            addContact(contact);
          };
          return <ContactTag contact={contact} onSelected={addToSendTo} key={contact._id} />;
        })}
        {contactEmails.map((c) => {
          const addToSendTo = () => {
            addEmail(c.email);
          };
          return <ContactEmailTag contact={c} onSelected={addToSendTo} key={c.email} />;
        })}
      </div>
    </div>
  </section>;


Component.propTypes = {
  addContact: React.PropTypes.func.isRequired,
  addEmail: React.PropTypes.func.isRequired,
  contacts: React.PropTypes.array.isRequired,
  contactEmails: React.PropTypes.array.isRequired,
};

const ComponentWData = composeWithTracker(data)(Component);

export default ComponentWData;
export { Component };
