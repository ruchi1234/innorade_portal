import React from 'react';
import { Header, Body, Content, Actions, Title } from '/imports/ui/components/modal';
import { openModal, closeModal } from '/imports/data/modal';

import ClipEditForm from '/imports/ui/components/bproducts/edit_form';

const formatCurrency = (num) => `$${parseFloat(String(num)).toFixed(2).replace(/(\d)(?=(\d\d\d)+(?!\d))/g, '$1,')}`;

const EditBProductModal = React.createClass({
  propTypes: {
    boardProduct: React.PropTypes.object,
    onSave: React.PropTypes.func,
    onRemove: React.PropTypes.func,
  },

  onCancel() {
    closeModal();
  },

  onRemove() {
    // const r = confirm('Are you sure you want to delete this clipping?');
    // if (r === true) {
    if (confirm('Are you sure you want to delete this clipping?')) {
      this.props.onRemove();
      closeModal();
    }
  },

  renderFooter() {
    return (
      <Actions
        actions={[{
          label: 'Cancel',
          action: this.onCancel,
        }, {
          label: 'Remove',
          action: this.onRemove,
        }, {
          label: 'Save',
          action: (e) => this.refs.form.editProduct(e),
        }]}
      />
    );
  },
  render() {
    return (
      <Content>
        <Header />
        <Body>
          <ClipEditForm
            ref="form"
            boardProduct={this.props.boardProduct}
            onSave={(p) => {
              this.props.onSave(p);
              closeModal();
            }}
          />
        </Body>
        {this.renderFooter()}
      </Content>
    );
  },
});

export default props => openModal(<EditBProductModal {...props} />);
