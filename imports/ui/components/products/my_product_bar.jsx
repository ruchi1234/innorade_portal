/* global utu */
import React from 'react';

import showAddClipModal from '/imports/ui/components/clip/add_modal';
import MyBar from '/imports/ui/components/my_bar';
import mixpanel from 'mixpanel-browser';

const MyProductsBar = () => (
  <MyBar>
    <button
      type="button"
      className="btn btn-primary"
      onClick={() => {
        showAddClipModal();
        mixpanel.track('Add Prod from My Product', {});
        utu.track('Add Prod from My Product', {});
      }}
    >
      Add Product
    </button>
  </MyBar>
);

export default MyProductsBar;
