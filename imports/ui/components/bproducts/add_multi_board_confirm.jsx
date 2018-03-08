import React from 'react';
import shallowCompare from 'react-addons-shallow-compare';
import { Meteor } from 'meteor/meteor';
import { FlowRouter } from 'meteor/kadira:flow-router';

import Subscriptions from '/imports/data/subscriptions';
import Boards from '/imports/modules/boards/collection';
import Row from '/imports/ui/components/grid/row';
import Col from '/imports/ui/components/grid/col';
import { closeModal } from '/imports/data/modal';

import ListCard from '/imports/ui/components/cards/list_card';

/**
 * file: client.components.mavelet.MaveletConfirm.jsx
 * by: MavenX - tewksbum Mar 2016
 * re: Publish the product to a number of boards
 */

const MaveletConfirm = React.createClass({
  propTypes: {
    cleanup: React.PropTypes.func,
    boards: React.PropTypes.array,
    ready: React.PropTypes.bool,
    openNewWindows: React.PropTypes.bool,
  },

  shouldComponentUpdate(nextProps, nextState) {
    return shallowCompare(this, nextProps, nextState);
  },

  componentWillUpdate() {
    this.props.cleanup();
  },

  componentWillUnmount() {
    this.props.cleanup();
  },

  render() {
    const { boards, ready, openNewWindows } = this.props;
    return (
      <section className="mavelet-confirm">
        <Row className="header-row">
          <Col xs={12}>
            <h2>
              The boards listed below were updated with your product clipping(s).
            </h2>
            <h4>
              Click on a board to view it. Or, close the window if done.
            </h4>
          </Col>
        </Row>
        <Row>
          <Col xs={12}>
            <div className="mavelet-wrapper">
              {boards.map((board) => {
                return (
                  <ListCard
                    onClick={() => {
                      if (openNewWindows) {
                        window.open(
                          `${Meteor.absoluteUrl()}board/${board._id}`,
                          '_blank'
                        );
                        window.close();
                      } else {
                        FlowRouter.go('board', { _id: board._id });
                        closeModal();
                      }
                    }}
                    board={board}
                    key={board._id}
                  />
                );
              })}
            </div>
          </Col>
          {!ready && <div className="loader"></div>}
        </Row>
      </section>
    );
  },
});

const MaveletConfirmWData = MeteorData(MaveletConfirm, {
  getData(props) {
    const { pubBoards } = props;
    const subs = pubBoards.map((boardId) => {
      return Subscriptions.subscribe('boardsById', boardId);
    });

    const boards = Boards.find({ _id: { $in: pubBoards } }).fetch();

    return {
      boards,
      ready: (boards.length === pubBoards.length),
      cleanup() {
        subs.forEach((sub) => {
          sub.stop();
        });
      },
    };
  },
});

export default MaveletConfirmWData;
