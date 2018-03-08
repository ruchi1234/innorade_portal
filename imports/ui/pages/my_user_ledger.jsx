import { Meteor } from 'meteor/meteor';
import React from 'react';
import moment from 'moment';
import 'moment-timezone';
import { FlowRouter } from 'meteor/kadira:flow-router';

import UserLedgers from '/imports/modules/user_ledgers/user_ledgers';
import UserLedgersBalance from '/imports/modules/user_ledgers/user_ledgers_balance';
import DateInput from '/imports/ui/components/form/inputs/date';

import Row from '/imports/ui/components/grid/row';
import Col from '/imports/ui/components/grid/col';
import Modal from '/imports/ui/components/modal/modal';
import ModalBody from '/imports/ui/components/modal/modal_body';
import ModalHeader from '/imports/ui/components/modal/modal_header';

const {
  DEFAULT_LIMIT,
  DEFAULT_INFINITE_SCROLL_OFFSET,
} = Mavenx.globals;

const FormatDate = (date) => {
  const formatted = moment(date).format('MM/DD/YY');
  return formatted;
};

const MyUserLedger = React.createClass({
  propTypes: {
    userLedgers: React.PropTypes.array.isRequired,
    ready: React.PropTypes.bool.isRequired,
    currentValue: React.PropTypes.number.isRequired,
    cleanup: React.PropTypes.func.isRequired,
    loadMore: React.PropTypes.func.isRequired,
    loggedIn: React.PropTypes.bool.isRequired,
  },

  getDefaultProps() {
    return {
      userLedgers: [],
      ready: true,
      currentValue: 0,
      cleanup: () => {},
    };
  },

  componentWillMount() {
    window.addEventListener('scroll', this.handleScroll);
  },

  componentDidMount() {
    const { loggedIn, ready, userLedgers } = this.props;
    if (!loggedIn || (ready && !userLedgers.length)) {
      this.refs.zeroBalanceFAQModal.show();
    }
  },

  componentDidUpdate() {
    const { loggedIn, ready, currentValue } = this.props;
    if (!loggedIn || (ready && !currentValue) && !this.zeroBalanceModalShown) {
      this.refs.zeroBalanceFAQModal.show();
      this.zeroBalanceModalShown = true;
    }
  },

  componentWillUnmount() {
    // because react isnt managing the event we need to remove it when the component unmounts
    window.removeEventListener('scroll', this.handleScroll);
    this.props.cleanup();
  },

  handleScroll() {
    if ((window.innerHeight + window.scrollY + DEFAULT_INFINITE_SCROLL_OFFSET) >= document.body.offsetHeight) {
      this.props.loadMore();
    }
  },

  currentBalanceFAQModalHTML() {
    return (
      <Modal ref="currentBalanceFAQModal">
        <ModalHeader />
        <ModalBody>
          <section className="modal-body-inner info-modals">
            <h2>
              Current Balance
            </h2>
            <label>
              What does the current balance mean?
            </label>
            <p>
              Your current balance at Maven Xchange is like your balance in a savings account. It
              is the amount of money you have earned at Maven Xchange that has not yet been paid to
              you.
            </p>

            <label>
              How often is the current balance updated?
            </label>
            <p>
              Your Dashboard is updated nightly.
            </p>

            <label>
              How is it calculated?
            </label>
            <p>
              We track all earnings-related activity on your Dashboard. When you have earnings
              resulting from sales at retailers (such as Commission Share or Referral Bonuses),
              your balance is increased. When retailers adjust or reverse commissions (usually as a
              result of shoppers returning merchandise they previously purchased), we reduce your
              balance.  Finally, when we send you a payment, we reduce your balance with us by that
              amount.  All of that activity can be seen in the below activity report.
            </p>

            <label>
              When will I be paid the current balance?
            </label>
            <p>
              See the Earning FAQs for details on payment timing and other payment-related details.
            </p>

            <label>
              Why doesn’t the amount in the detail below match the balance?
            </label>
            <p>
              The activity below is usually for a limited date range, which you can change.  The
              balance reflects all activity for the life of your account.
            </p>

            <label>
              Why must my email be verified?
            </label>
            <p>
              We send payments to you using your email address from your profile.  To avoid sending
              payments to the wrong person, we require that you verify your email address before we
              will send any payments to you.  Otherwise, the wrong person might receive your
              payment.  So, please verify your email address.
            </p>
          </section>
        </ModalBody>
      </Modal>
    );
  },

  earningsActivityFAQModalHTML() {
    return (
      <Modal ref="earningsActivityFAQModal">
        <ModalHeader />
        <ModalBody>
          <section className="modal-body-inner info-modals">
            <h2>
              Earnings Activity
            </h2>
            <label>
              Why does the detail sometimes not show complete information about a transaction?
            </label>
            <p>
              We provide all the pertinent information we receive from retailers regarding sales
              activity. Sometimes, the information labeled “details” is limited. So, for example,
              you might not see a sales amount for a sales transaction. This can happen if the
              retailers or our processing partners have technical limitations. Note that the
              earnings data for you is not affected by these limitations and is accurate.
            </p>

            <label>
              You show a payment but I have not yet received it.  What should I do?
            </label>
            <p>
              We post “payment” activity to your account on the day the payment is issued to you
              via Paypal.  Please check your email for a notification from Paypal regarding your
              payment. If you have not receive notice of a payment from Paypal one day after the
              posting date of a payment shown in your Dashboard, please visit the Get Support page
              and let us know.  We will investigate the issue immediately.
            </p>

            <label>
              I think there is a commission missing.  What do I do?
            </label>
            <p>
              Retailers report sales and commissions at differing times.  For example, some
              retailers report sales on the date of purchase; other retailers report sales when
              products are shipped or even later.  Hotels, for example, typically report sales
              only after the stay in the hotel has been completed and paid.
            </p>

            <p>
              See the Earning FAQs for other possible causes and details.
            </p>

            <label>
              Why must my email be verified?
            </label>
            <p>
              We send payments to you using your email address from your profile.  To avoid sending
              payments to the wrong person, we require that you verify your email address before
              we will send any payments to you.  Otherwise, the wrong person might receive your
              payment.  So, please verify your email address.
            </p>
          </section>
        </ModalBody>
      </Modal>
    );
  },

  zeroBalanceFAQModalHTML() {
    return (<Modal ref="zeroBalanceFAQModal">
      <ModalHeader className="text-center">
        <h2>Clip Earn Share</h2>
      </ModalHeader>
      <ModalBody>
        <section className="zeroBalanceFAQModal">
          <h3>
            You don’t have any recent earnings. Why not
            create a board of your favorite products and share
            it with your friends?
          </h3>
          <Row>
            <Col className="col-md-offset-0" xs={12} smOffset={3} sm={6} md={4} lg={4}>
              <img
                className="img-responsive"
                src="/img/user_ledger/logged_out_faq_image.png"
                role="presentation"
              />
            </Col>
            <Col xs={12} sm={12} md={8} lg={8}>
              <ul>
                <li>
                  Clip products from thousands of retailers to create boards of your choosing.
                </li>
                <li>
                  Share your style, taste, and expertise with our network and yours to gain favorites, followers and friends.
                </li>
                <li>
                  Earn when someone clicks and buys based on your boards or product recommendations.
                </li>
              </ul>
            </Col>
          </Row>
          <Row>
            <h3>
              Clip. Share. Earn.
            </h3>
          </Row>
        </section>
      </ModalBody>
    </Modal>);
  },

  dateInputHTML(date, changeDate) {
    const onChange = (val) => {
      if (val) {
        // The input is in utc, so we correct for this
        // by adding tz offset
        const adjusted = moment(val).add('minutes', val.getTimezoneOffset());
        changeDate(adjusted.toDate());
      } else {
        changeDate(undefined);
      }
    };
    return (<DateInput
      className="filter"
      value={date}
      onChange={onChange}
    />);
  },

  render() {
    const {
      userLedgers,
      startDate,
      setStartDate,
      endDate,
      setEndDate,
      ready,
      currentValue,
    } = this.props;

    return (<div className="container my-user-ledger">
      {this.currentBalanceFAQModalHTML()}
      {this.earningsActivityFAQModalHTML()}
      {this.zeroBalanceFAQModalHTML()}
      <Row>
        <Col xs={12} sm={12} lg={12}>
          <label>
            Current Balance:&nbsp;
          </label>
          <span className="current-balance">
            ${currentValue.toFixed(2)}&nbsp;
            <a href="#">
              <span
                className="glyphicon glyphicon-info-sign"
                onClick={() => this.refs.currentBalanceFAQModal.show()}
              ></span>
            </a>
          </span>
        </Col>
      </Row>
      <Row>
        <Col xs={12} sm={12} lg={12}>
          <label>Activity:</label>
        </Col>
      </Row>
      <Row className="filters">
        <Col xs={12} sm={3} lg={3}>
          <label>From:</label>
          {this.dateInputHTML(startDate, setStartDate)}
        </Col>
        <Col xs={12} sm={3} lg={3}>
          <label>To:</label>
          {this.dateInputHTML(endDate, setEndDate)}
        </Col>
      </Row>

      <Row>
        <Col xs={12} sm={12} lg={12}>
          <table className="table-bordered table-hover table-responsive table-striped">
            <thead>
              <tr>
                <th>
                  Date
                </th>
                <th>
                  Activity
                </th>
                <th>
                  Details
                </th>

                <th>
                  Earnings
                </th>

                <th>
                  <a href="#" onClick={() => this.refs.earningsActivityFAQModal.show()}>
                    <span className="glyphicon glyphicon-info-sign"></span>
                  </a>
                </th>
              </tr>
            </thead>
            <tbody>
              {userLedgers.map((ul) => {
                const bproductHref = FlowRouter.path('product', { _id: ul.boardProductsId });

                return (<tr key={ul._id} className={ul.isPayment() ? 'payment' : ''}>
                  <td>{FormatDate(ul.postDate)}</td>
                  <td>{ul.type}</td>
                  <td>{ul.description}</td>

                  {/* If it's negative handle formattnig differently*/}
                  <td>
                    {ul.amount < 0 ? `-$(${-ul.amount.toFixed(2)})` : `$${ul.amount.toFixed(2)}`}
                  </td>
                  <td>
                    {ul.boardProductsId &&
                      (<a href={bproductHref}>
                        <span className="glyphicon glyphicon-paperclip" />
                      </a>)
                    }
                  </td>
                </tr>);
              })}
            </tbody>
          </table>
        </Col>
      </Row>
      {!ready ? <div className="loader"></div> : ''}
    </div>);
  },
});

/*
 * Variable to hold the current query
 * for this page.
 *
 * It's not important to store this query in url
 * but we'd like to keep it between renders, so it needs
 * stored outside the component state
 */
const query = new ReactiveVar({
  postDate: {
    $gt: moment().startOf('month').toDate(),
    $lt: moment().endOf('day').toDate(),
  },
});

// TODO: how much of the above can move from module, into stateless component?
const limit = new ReactiveVar(DEFAULT_LIMIT * 2);

const MyUserLedgerWData = MeteorData(MyUserLedger, {
  getData() {
    if (!Meteor.userId()) { return {}; }

    const options = { limit: limit.get() };

    const ready = Meteor.subscribe('userLedgersByArgs', query.get(), options).ready();
    Meteor.subscribe('UserLedgersBalanceById');

    const sum = UserLedgersBalance.findOne({ userId: Meteor.userId() });
    const currentValue = sum ? sum.sum : 0;

    return {
      userLedgers: UserLedgers.find(query.get(),
        Object.assign(options, { sort: { postDate: -1 } })).fetch(),
      loggedIn: !!Meteor.userId(),
      ready,
      // TODO: can / does it make sense to do so?  some day maybe...
      // these make it into global helper?
      startDate: query.get().postDate.$gt,
      setStartDate: (startDate) => {
        const q = query.get();
        if (startDate) {
          q.postDate.$gt = startDate;
        } else {
          delete q.postDate.$gt;
        }
        query.set(q);
      },
      endDate: query.get().postDate.$lt,
      setEndDate: (endDate) => {
        const q = query.get();
        if (endDate) {
          q.postDate.$lt = moment(endDate).endOf('day').toDate();
        } else {
          delete q.postDate.$lt;
        }
        query.set(q);
      },
      currentValue,

      cleanup() {
        limit.set(DEFAULT_LIMIT * 2);
      },
      loadMore() {
        /*
         * Only increase the limit if we have documents equal to the current limit
         * meaning there may be more
         */
        if (UserLedgers.find(query.get(), options).count() === limit.get()) {
          limit.set(limit.get() + DEFAULT_LIMIT);
        }
      },
    };
  },
});

export default MyUserLedgerWData;
