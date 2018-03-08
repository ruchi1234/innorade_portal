import { _ } from 'meteor/underscore';
import EventHorizon from 'meteor/patrickml:event-horizon';

const defaultStore = {
  small: false,
  open: false,
  type: '',
  Component: null,
};

EventHorizon.createAction('modal', 'OPEN_MODAL', (store, data, update) => {
  update(Object.assign({
    open: true,
  }, data));
});

// this action closes and resets the modal back to its original state
EventHorizon.createAction('modal', 'CLOSE_MODAL', (store, data, update) => {
  update(defaultStore);
});
const closeModal = () => EventHorizon.dispatch('CLOSE_MODAL');

const openModal = (Component, options) => EventHorizon.dispatch('OPEN_MODAL', _.extend({
  Component,
}, options));

EventHorizon.createStore('modal', defaultStore);

const modalType = () => EventHorizon.subscribe('modal').type;

export { openModal, closeModal, modalType };
