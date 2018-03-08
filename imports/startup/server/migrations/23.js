import { Meteor } from 'meteor/meteor';
import { Migrations } from 'meteor/percolate:migrations';
// import Products from '/imports/modules/products/collection';
import Clips from '/imports/modules/clips/collection';
import Boards from '/imports/modules/boards/collection';
const Users = Meteor.users;

Migrations.add({
  version: 23,
  name: 'Update all collections w/ images to include creatorId',
  up: () => {
    Clips.find().forEach((clip) => {
      if (clip.images && clip.images.length > 0) {
        const newImages = clip.images.map(function(image){ image.creatorId = clip.creatorId; return image});
        console.log(clip.images);
        console.log(newImages);
        Clips.update(
          { _id: clip._id },
          { $set: { images: newImages } },
          { bypassCollection2: true }
        );
      }
    });
    Boards.find().forEach((board) => {
      if (board.images && board.images.length > 0) {
        const newImages = board.images.map(function(image){ image.creatorId = board.creatorId || board.userId; return image});
        Boards.update(
          { _id: board._id },
          { $set: { images: newImages } },
          { bypassCollection2: true }
        );
      }
    });
    Users.find().forEach((user) => {
      if (user.profile.images && user.profile.images.length > 0) {
        const newImages = user.profile.images.map(function(image){ image.creatorId = user._id; return image});
        console.log(user.profile.images);
        console.log(newImages);
        Users.update(
          { _id: user._id },
          { $set: { 'profile.images': newImages } },
          { bypassCollection2: true }
        );
      }
    });
  },
});

// title_sort

    //   const imgz = clip.images && clip.images.map((image) => image.creatorId = clip.creatorId) || [];
    //   Clips.update(
    //     { _id: clip._id },
    //     { $set: { images: imgz } },
    //     { bypassCollection2: true }
    //   );
    // });
    //   ... set creatorId)
    //   if (clip.images) {
    //     Clips.update(
    //       { _id: clip._id },
    //       { $set: { 'images.creatorId': clip.creatorId } },
    //       { multi: true, bypassCollection2: true }
    //     );
    //   }
    // });
    // Boards.find().forEach((board) => {
    //   const imgz = board.images && board.images.map((image) => image.creatorId = board.creatorId) || [];
    //   // if (board.images) {
    //   Boards.update(
    //     { _id: board._id },
    //     { $set: { images: imgz } },
    //     { bypassCollection2: true }
    //   );
    //   // }
    // });
    // Users.find().forEach((user) => {
    //   const imgz = user.profile.images && user.profile.images.map((image) => image.creatorId = user._id) || [];
    //   // if (user.images) {
    //   Users.update(
    //     { _id: user._id },
    //     { $set: { images: imgz } },
    //     { bypassCollection2: true }
    //   );
    //   // }
//     // });
//   },
// });
