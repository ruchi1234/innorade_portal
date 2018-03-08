import moment from 'moment';
import 'moment-timezone';

const FormatDate = (date) => {
  const formatted = moment(date).format('MM/DD/YY');
  return formatted;
};

export default FormatDate;
