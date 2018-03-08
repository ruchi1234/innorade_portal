import React from 'react';
import ReactDOM from 'react-dom';
import $ from 'jquery';
import moment from 'moment';
import 'moment-timezone';
import { Meteor } from 'meteor/meteor';
import { ReactiveVar } from 'meteor/reactive-var';
import { composeWithTracker } from 'react-komposer';
import 'jquery-ui';
import 'jquery-datepicker';

// Seems to put the crap on window...
import 'meteor/cwaring:modernizr';

/*
 * Clear on invalid lose focus
 * onChange triggered on valid lose focus
 */
class DateInput extends React.Component {
  constructor() {
    super();
    this.onChange = this.onChange.bind(this);
  }

  componentDidMount() {
    this.checkCompat();
  }

  componentDidUpdate() {
    this.checkCompat();
  }

  onChange(val) {
    // ios safari passes empty string instead of null or undefined for some reason.
    if (val === '' || val === undefined) { this.props.onChange(undefined); }

    const regexDate = /^\d{4}\-\d{1,2}\-\d{1,2}$/;
    if (regexDate.test(val)) {
      this.props.onChange(moment.utc(val).toDate());
    }
  }

  checkCompat() {
    if (!this.props.dateInputSupported) {
      this.datepicker = $(ReactDOM.findDOMNode(this)).datepicker({
        // Consistent format with the HTML5 picker
        dateFormat: 'yy-mm-dd',
        onSelect: (val) => {
          this.onChange(val);
        },
      });
    }
  }

  render() {
    const { value, className } = this.props;

    // if clicked, and using jquery datepicker
    // Don't focus field, but show datepicker
    const onClick = (e) => {
      if (this.datepicker) {
        e.preventDefault();
        e.stopPropagation();
        this.datepicker.show();
        $(e.currentTarget).blur();
      }
    };

    return (<input
      className={`date-input ${className}`}
      type="date"
      required
      value={value ? moment(value).format('YYYY-MM-DD') : undefined}
      onClick={onClick}
      onChange={(e) => this.onChange(e.currentTarget.value)}
      onKeyDown={(e) => { e.preventDefault(); e.stopPropagation(); }}
    />);
  }
}

DateInput.propTypes = {
  className: React.PropTypes.string,
  value: React.PropTypes.instanceOf(Date),
  onChange: React.PropTypes.func.isRequired,
  dateInputSupported: React.PropTypes.bool.isRequired,
};

DateInput.defaultProps = {
  className: '',
};

/*
 * Check date support
 */
const supportDate = new ReactiveVar(true);
Meteor.startup(() => {
  supportDate.set(window.Modernizr.inputtypes.date);
});

export default composeWithTracker((props, onData) => (
  onData(null, { dateInputSupported: supportDate.get() })
))(DateInput);
