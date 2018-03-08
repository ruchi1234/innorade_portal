import React from 'react';
import ReactDOM from 'react-dom';
import { openModal, closeModal } from '/imports/data/modal';
import { Title, Header, Body, Actions, Content } from '/imports/ui/components/modal';
import select from 'select';
import autosize from 'autosize';

class SafariCopy extends React.Component {
  componentDidMount() {
    const node = ReactDOM.findDOMNode(this.refs.clipboardContent);
    select(node);
    autosize(node);
  }

  componentDidUpdate() {
    const node = ReactDOM.findDOMNode(this.refs.clipboardContent);
    autosize(node);
  }

  render() {
    const { clipboardContent } = this.props;
    return (
      <Content className="safari-modal">
        <Header />
        <Body>
          <Title>
            Copy the below text
          </Title>
          <textarea
            value={clipboardContent}
            readOnly
            ref="clipboardContent"
          />
        </Body>
        <Actions
          actions={[{
            label: 'Done',
            action: closeModal,
          }]}
        />
      </Content>
    );
  }
}

SafariCopy.propTypes = {
  clipboardContent: React.PropTypes.string,
};

export default (props) => openModal(<SafariCopy {...props} />, { small: true });
