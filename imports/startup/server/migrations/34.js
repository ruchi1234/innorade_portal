import { Migrations } from 'meteor/percolate:migrations';
import Products from '/imports/modules/products/collection';
import Clips from '/imports/modules/clips/collection';

Migrations.add({
  version: 34,
  name: 'Whack the offending lego Clip - JYsArxKhqXjn6gSiB',
  up: () => {
    Clips.remove({ productId: 'JYsArxKhqXjn6gSiB' }, { multi: true });
    Products.remove({ _id: 'JYsArxKhqXjn6gSiB' });
    // Clips.remove({ _id: 't5xYH9fBLNirvmmAN' }, { multi: true });  // staging run
  },
});
