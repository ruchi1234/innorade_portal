import { Meteor } from 'meteor/meteor';
import { DEFAULT_LIMIT } from '/imports/startup/vars';
import moment from 'moment';

const FormatDate = (date) => {
  const formatted = moment(date).format('MM/DD/YYYY');
  return formatted;
};


// TODO migrate to komposer and data directory
const MeteorListData = (options) => {
  const {
      subscribe,
      documents,
  } = options;

  return (props, onData) => {
    const sub = subscribe(props);
    const docs = documents(props);

    /*
     * Determine if we can potentially load more
     * this is ugly.
     *
     * If we have all data for this section
     * and boardProducts length was equal to page size
     * we have more data, tell parent to continue
     */
    if (docs.length === DEFAULT_LIMIT && props.canLoadMore) {
      props.canLoadMore();
    }

    const ready = sub.ready() || docs.length === DEFAULT_LIMIT;

    onData(null, {
      docs,
      ready,
    });

    return () => sub.stop();
  };
};

Number.prototype.formatMoney = function(c, d, t){
var n = this,
    c = isNaN(c = Math.abs(c)) ? 2 : c,
    d = d == undefined ? "." : d,
    t = t == undefined ? "," : t,
    s = n < 0 ? "-" : "",
    i = parseInt(n = Math.abs(+n || 0).toFixed(c)) + "",
    j = (j = i.length) > 3 ? j % 3 : 0;
   return s + (j ? i.substr(0, j) + t : "") + i.substr(j).replace(/(\d{3})(?=\d)/g, "$1" + t) + (c ? d + Math.abs(n - i).toFixed(c).slice(2) : "");
 };



export { FormatDate, MeteorListData };
