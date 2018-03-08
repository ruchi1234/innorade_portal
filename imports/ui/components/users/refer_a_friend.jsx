/* global utu */
import React from 'react';
import { Meteor } from 'meteor/meteor';
import canHOC from '/imports/ui/can_hoc';
import Container from '/imports/ui/components/grid/container';
import Row from '/imports/ui/components/grid/row';
import Col from '/imports/ui/components/grid/col';
import { composeWithTracker } from 'react-komposer';
import loginData from '/imports/data/users/login_state';
import StaticLinks from '/imports/startup/static_links';
import Modal from './refer_a_friend_invite_modal';
import ClipBtn from '/imports/ui/components/clipboard/btn';
import mixpanel from 'mixpanel-browser';

class Component extends React.Component {
  render() {
    const { userId } = this.props;
    const shareUrl = `${Meteor.absoluteUrl()}boards?raf=${userId}`;
    return (
      <Container>
        <Row>
          <Col lg={6} lgOffset={3} md={8} mdOffset={2} sm={12}>
            <section className="refer-a-friend">
              <div className="explain">
                <h2>Refer a Friend</h2>
                <br />
                <p>
                  Do you know someone who would enjoy promoting their own style,
                  taste and expertise? Or, maybe your friend just likes helping other
                  people shop?
                </p>
                <p>
                  Send them an invitation to Maven Xchange. They will earn when products they
                  recommend are purchased. And since you referred them, you will earn too. See
                  our&nbsp;
                  <a href={StaticLinks.earningsPolicy} target="_blank">Earnings Policy</a>
                  &nbsp;for details.
                </p>
              </div>

              <br />

              <div className="actions">
                <a
                  className="btn btn-custom"
                  onClick={() => this.refs.emailModal.show()}
                >
                  Send an Invitation
                </a>
                <ClipBtn
                  className="btn btn-custom"
                  clipboardContent={shareUrl}
                  onSuccess={() => {
                    mixpanel.track('Copy Refer a Friend Link', {
                      userId: Meteor.userId(),
                    });
                    utu.track('Copy Refer a Friend Link', {
                      userId: Meteor.userId(),
                    });
                    Bert.alert('Copied to clipboard', 'success', 'fixed-top', 'fa-info');
                  }}
                >
                 Copy URL
                </ClipBtn>
              </div>
              <p className="fine-print">
                Refer a Friend URL to build your own links: <a href={shareUrl}>
                  {shareUrl}
                </a>
              </p>
            </section>
          </Col>
        </Row>
        <Modal ref="emailModal" />
      </Container>
    );
  }
}

Component.propTypes = {
  userId: React.PropTypes.string.isRequired,
};

const ComponentWLoginData = composeWithTracker(loginData)(Component);
export default canHOC(ComponentWLoginData, { allowNonVerified: true });
