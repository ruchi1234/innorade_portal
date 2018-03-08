import React from 'react';
import showAddEditBoardModal from '/imports/ui/components/boards/add_edit_modal';
import MyBar from '/imports/ui/components/my_bar';
import canHOF from '/imports/modules/can/can_hof';
import { showRegister } from '/imports/ui/components/login/modal';


const addboard = () => {
  canHOF({
    action: 'insert',
    type: 'board',
    handleLogin: () => {
      showRegister({ message: 'To creat a board please login or create an account.' });
    },
    handleAction: () => {
      showAddEditBoardModal();
    },
  })();
};

const MyBoardsBar = () => (
  <MyBar>
    <button
      type="button"
      className="btn btn-primary"
      data-toggle="modal"
      data-target="#boardmodal"
      onClick={() => addboard()}
    >
      Build a Board
    </button>
  </MyBar>
);

export default MyBoardsBar;
