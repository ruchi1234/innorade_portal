import { Migrations } from 'meteor/percolate:migrations';
import Users from '/imports/modules/users/users';

Migrations.add({
  version: 36,
  name: 'Append slug to all users',
  up: () => {
    Users.find().forEach((u) => {
      const slug = u.username.replace(/(?!\w|\s)./g, '')
        .replace(/\s+/g, '')
        .replace(/^(\s*)([\W\w]*)(\b\s*$)/g, '$2');
      Users.direct.update({ _id: u._id }, { $set: { slug: slug, favoritedCount: 0 } });
    });
  },
});
