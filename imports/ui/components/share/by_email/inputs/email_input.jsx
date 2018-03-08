import React from 'react';
import ReactDOM from 'react-dom';
import { SimpleSchema } from 'meteor/aldeed:simple-schema';

class EmailInput extends React.Component {
  constructor() {
    super();
    this.handleAddEmail = this.handleAddEmail.bind(this);

    this.state = {};
  }

  handleAddEmail(e) {
    if (e) { e.preventDefault(); }

    const { addEmail } = this.props;
    const emailInput = ReactDOM.findDOMNode(this.refs.input);
    const email = emailInput.value;

    if (SimpleSchema.RegEx.Email.test(email)) {
      addEmail(email);
      this.reset();
    } else {
      this.setState({ error: 'Please enter an email address' });
    }
  }

  reset() {
    const emailInput = ReactDOM.findDOMNode(this.refs.input);
    this.setState({ error: undefined });
    emailInput.value = '';
  }

  render() {
    const { error } = this.state;
    return (
      <form onSubmit={this.handleAddEmail}>
        <label htmlFor="emailInput" className={`${error && 'text-error' || ''}`}>
          Email Address
        </label>

        <div className={`input-group ${error && 'has-error' || ''}`}>
          <input
            id="email-input"
            ref="input"
            type="email"
            className="form-control"
            placeholder="Enter email address of recipient"
          />
          <span className="input-group-btn" onClick={this.handleAddEmail}>
            <button className="btn btn-default btn-block btn-custom" type="button">Add</button>
          </span>
        </div>

        {error &&
          <p className="text-error">
            {error}
          </p>
        }

        <button
          className="add-email-btn btn btn btn-default btn-block btn-custom btn-inline"
          type="submit"
          style={{ display: 'none' }}
          ref="addEmailBtn"
        >
          Add
        </button>
      </form>
    );
  }
}

EmailInput.propTypes = {
  addEmail: React.PropTypes.func.isRequired,
};

export default EmailInput;
