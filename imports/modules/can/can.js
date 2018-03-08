import Boards from '/imports/modules/boards/collection';
import Products from '/imports/modules/products/collection';
import Clips from '/imports/modules/clips/collection';

/*
 * This is basically an ACL layer
 */
export default {
  // INSERT
  insert: {
    board(userId, doc) {
      if (!userId) { return false; }

      // TODO check creator is you ?
      return true;
    },
    product(userId, doc) {
      if (!userId) { return false; }

      // TODO check creator is you ?
      return true;
    },
    clip(userId, doc) {
      if (!userId) { return false; }
      if (!doc) { return true; }
      const clip = doc;

      const board = Boards.findOne(clip.boardId);
      // board creator or open
      return board && (board.creatorId === userId || !board.status);
    },
  },

  // UPDATE
  update: {
    board(userId, docOrId, modifier) {
      if (!userId) { return false; }

      const board = (typeof(docOrId) === 'string') ? Boards.findOne(docOrId) : docOrId;

      if (!board) {
        // Deny if not found
        return false;
      } else {
        return (board.creatorId === userId);
      }
    },
    product(userId, docOrId, modifier) {
      // NOTE: anyone can update a product
      if (!userId) { return false; }

      return true;
      // const product = (typeof(docOrId) === 'string') ? Products.findOne(docOrId) : docOrId;
      // if (!product) {
      //   // Deny if not found
      //   return false;
      // } else {
      //   const creator = product.creator || {};
      //   const open = (product.status === 1);
      //   return creator.userId === userId || open;
      // }
    },
    clip(userId, docOrId, modifier) {
      if (!userId) { return false; }

      const clip = (typeof(docOrId) === 'string') ? Clips.findOne(docOrId) : docOrId;
      if (!clip) {
        // Deny if not found
        return false;
      } else {
        return (clip.creatorId === userId);
      }
    },

    user(userId, uid) {
      return userId === uid;
    },
  },

  // FAVORITE
  favorite: {
    board(userId) {
      return !!userId;
    },
    clip(userId) {
      return !!userId;
    },
    product(userId) {
      return !!userId;
    },
    user(userId) {
      return !!userId;
    },
  },

  // INVITE
  invite: {
    board(userId, docOrId) {
      const board = (typeof(docOrId) === 'string') ? Boards.findOne(docOrId) : docOrId;

      if (!board) {
        return false;
      }

      // if private
      if (board.type) {
        return board.creatorId === userId;
      }

      return true;
    },
    profileEmbed(userId) {
      return !!userId;
    },
    clip(userId, docOrId) {
      const clip = (typeof(docOrId) === 'string') ? Clips.findOne(docOrId) : docOrId;

      if (!clip) {
        return false;
      }

      // if private
      if (clip.type) {
        return clip.boardCreatorId === userId;
      }

      return true;
    },
  },

  remove: {
    clip(userId, docOrId) {
      let response = false;
      if (!userId) { return false; }

      const clip = (
        typeof(docOrId) === 'string'
      )
      ? Clips.findOne(docOrId)
      : docOrId;

      if (!clip) {
        response = false;
      } else {
        const boardOwner = (
          typeof(clip.creatorId) === 'string'
        )
        ? Boards.findOne({ _id: clip.boardId }).creatorId
        : '';
        if (!boardOwner) {
          response = false;
        } else {
          response = (clip.creatorId === userId) || (userId === boardOwner);
        }
      }
      return response;
    },
  },
  clipToBoard(userId, docOrId) {
    if (!userId) { return false; }

    const board = (typeof(docOrId) === 'string') ? Boards.findOne(docOrId) : docOrId;

    if (!board) {
      // Deny if not found
      return false;
    } else {
      const open = (board.status === 0);
      return (board.creatorId === userId) || open;
    }
  },

  // RECLIP
  reclip: {
    clip(userId) {
      return !!userId;
    },
  },

  // SHARE
  share: {
    byEmail(userId) {
      return !!userId;
    },
    board(userId, docOrId) {
      const board = (typeof(docOrId) === 'string') ? Boards.findOne(docOrId) : docOrId;

      if (!board) {
        return false;
      }

      return !board.type || board.creatorId === userId;
    },
    boardEmbed(userId, docOrId) {
      const board = (typeof(docOrId) === 'string') ? Boards.findOne(docOrId) : docOrId;

      if (!board) {
        return false;
      }

      return board.creatorId === userId;
    },
    clip(userId, docOrId) {
      const clip = (typeof(docOrId) === 'string') ? Clips.findOne(docOrId) : docOrId;

      if (!clip) {
        return false;
      }
      if (clip.type) {
        return clip.boardCreatorId === userId;
      }
      return true;
    },
    clipEmbed(userId, docOrId) {
      const clip = (typeof(docOrId) === 'string') ? Clips.findOne(docOrId) : docOrId;

      if (!clip) {
        return false;
      }

      return clip.creatorId === userId;
    },

    raf(userId) {
      return !!userId;
    },
    user(userId) {
      return !!userId;
    },
    profileEmbed(userId) {
      return !!userId;
    },
  },
};
