/* global utu */
import React from 'react';
import { Meteor } from 'meteor/meteor';
import mixpanel from 'mixpanel-browser';
import { FlowRouter } from 'meteor/kadira:flow-router';
import { composeWithTracker } from 'react-komposer';
import { openModal, closeModal } from '/imports/data/modal';
import { Header, Body, Content, Actions, Title } from '/imports/ui/components/modal';
import CheckBox from '/imports/ui/components/checkbox';
import Col from '/imports/ui/components/grid/col';
import Row from '/imports/ui/components/grid/row';
import data from '/imports/data/boards/byId';

const AddEditModal = React.createClass({
  propTypes: {
    onRemove: React.PropTypes.func,
    onCancel: React.PropTypes.func,
    board: React.PropTypes.object,
    boardId: React.PropTypes.string,
    style: React.PropTypes.string,
  },

  getDefaultProps() {
    return {
      changeType: (event) => void event,
      changeStatus: (event) => void event,
    };
  },

  getInitialState() {
    const boardStatus = _.get(this.props, 'board.status');
    const boardType = _.get(this.props, 'board.type');
    return {
      caption: _.get(this.props, 'board.caption') || undefined,
      status: !!(boardStatus === undefined ? true : boardStatus),
      title: _.get(this.props, 'board.title') || undefined,
      type: !!(boardType),
    };
  },

  onAdd() {
    const { caption, title } = this.refs;
    const { status, type } = this.state;
    if (caption.value && title.value) {
      const doc = {
        caption: caption.value,
        title: title.value,
        status: status ? 1 : 0,
        type: type ? 1 : 0,
      };
      Meteor.call('board.insert', doc, (err, res) => {
        if (!err) {
          mixpanel.track('Added Board', doc);
          utu.track('Added Board', doc);
          closeModal();
          FlowRouter.go('board', { _id: res });
        }
      });
    } else {
      Bert.alert(
        'Name and caption are required.',
        'danger',
        'fixed-top',
        'fa-frown-o'
      );
    }
  },

  onDelete() {
    const r = confirm(
      'This board will be deleted. In addition, all product clippings on this ' +
      'board will be deleted. If you wish to save any products from this board, ' +
      're-clip them to other boards before you delete this board. Please confirm ' +
      'you wish to delete this board.'
    );
    if (r === true) {
      const { boardId } = this.props;
      Meteor.call('board.remove', boardId, (err) => {
        if (!err) {
          mixpanel.track('Deleted Board', {
            boardId,
          });
          utu.track('Deleted Board', {
            boardId,
          });
          FlowRouter.go('myboards');
          closeModal();
        }
      });
    }
  },

  onSave() {
    const { caption, title } = this.refs;
    const { status, type } = this.state;
    const { boardId } = this.props;
    if (caption.value && title.value) {
      const doc = {
        caption: caption.value,
        title: title.value,
        status: status ? 1 : 0,
        type: type ? 1 : 0,
      };
      Meteor.call('board.update', boardId, doc, () => {
        closeModal();
      });
    } else {
      Bert.alert('You\'ve missed a required field!', 'danger', 'fixed-top', 'fa-frown-o');
    }
  },

  changeType(event) {
    this.setState({ type: !event.target.checked });
    this.props.changeType(event);
  },

  changeStatus(event) {
    this.setState({ status: !event.target.checked });
    this.props.changeStatus(event);
  },

  renderFooter() {
    if (!this.props.boardId) {
      return (
        <Actions
          actions={[{
            label: 'Add',
            action: this.onAdd,
          }]}
        />
      );
    }

    return (
      <Actions
        actions={[{
          label: 'Cancel',
          action: closeModal,
        }, {
          label: 'Delete',
          action: this.onDelete,
        }, {
          label: 'Save',
          action: this.onSave,
        }]}
      />
    );
  },

  render() {
    let typeMessage = '';
    let statusMessage = '';

    if (!this.state.status) {
      statusMessage = `
      This board will be open, which allows other members of Maven Xchange to clip
      products they recommend to this board.
      `;
    } else {
      statusMessage = `
      This board will be locked, which means only you will be allowed to clip products
      to this board.
      `;
    }

    if (!this.state.type) {
      typeMessage = `
      This board will be public. It will be visible to everyone visiting Maven
      Xchange. You will also be able to publish this board on social media sites.
      `;
    } else {
      typeMessage = `
      This board will be private.  Private boards are only visible to someone if you send
      them the board or products from the board.  Private boards cannot be published to
      social media sites.
      `;
    }
    const { caption, status, title, type, boardId } = this.state;
    return (
      <Content>
        <Header />
        <Body>
          <Title>
            {!boardId ? 'Add Board' : 'Edit Board'}
          </Title>
          <section className="boardAddEdit">
            <label className="questionLabel">Board Name:</label>
            <textarea
              id="title"
              ref="title"
              type="text"
              placeholder="Enter a short name for your board."
              autoComplete="on"
              defaultValue={title}
              maxLength="10000"
            ></textarea>

            <label className="questionLabel">Your Board Caption:</label>
            <textarea
              id="caption"
              ref="caption"
              maxLength="10000"
              placeholder="Enter a summary describing what is special about your board."
              defaultValue={caption}
            ></textarea>

            <p className="questionLabel">
              Make the board public?
            </p>
            <label className="radioLabel">
              <CheckBox
                id="typeYes"
                type="checkbox"
                name="privateBoard"
                value={!type}
                onChange={this.changeType}
              />
              <div className="slider-check">
                {
                  !type &&
                    (<span className="left">yes</span>) ||
                    (<span className="right">no</span>)
                }
              </div>
            </label>
            <p>
              {
                typeMessage
              }
            </p>
          </section>
        </Body>
        {this.renderFooter()}
      </Content>
    );
  },
});

const AddEditModalWData = composeWithTracker(data)(AddEditModal);

export default (props) => openModal(<AddEditModalWData {...props} />);
