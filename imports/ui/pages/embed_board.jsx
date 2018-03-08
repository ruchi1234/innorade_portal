import React, { PropTypes } from 'react';

import EmbedCard from '/imports/ui/components/cards/hero_card/embed_board_card';

const EmbedBoard = ({ boardId }) => <EmbedCard boardId={boardId} />;

EmbedBoard.propTypes = {
  boardId: PropTypes.string.isRequired,
};

export default EmbedBoard;
