import React from 'react';
import BProductsList from '/imports/ui/pages/bproducts_list';

import canHOC from '/imports/ui/can_hoc';

const MyProducts = (props) => (
  <BProductsList controller="my" defaultFilter={''} {...props} />
);

const AuthenticatedMyProducts = canHOC(MyProducts, {
  allowNonVerified: true,
});
export default AuthenticatedMyProducts;
