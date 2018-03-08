import { Meteor } from 'meteor/meteor';

const { expect } = chai;
if (Meteor.isClient) {
  const Can = require('./can').default;
  const CanHOF = require('./can_hof').default;

  Can.handleSomething = {
    yes: () => true,
    no: () => false,
  };

  describe('Can HOF', function () {
    before(function before() {
      this._userIdFunc = Meteor.userId;
    });

    after(function after() {
      Meteor.userId = this._userIdFunc;
    });

    it('should call handle login if user not logged in', () => {
      Meteor.userId = () => undefined;

      let calledLogin = false;
      let calledActionFn = false;
      let calledHandleDeny = false;

      const func = CanHOF({
        action: 'handleSomething',
        type: 'yes',
        handleLogin: () => { calledLogin = true; },
        handleDeny: () => { calledHandleDeny = true; },
        handleAction: () => { calledActionFn = true; },
      })();

      expect(calledActionFn).to.equal(false);
      expect(calledLogin).to.equal(true);
      expect(calledHandleDeny).to.equal(false);
    });

    it('should call action if logged in and allowed', () => {
      Meteor.userId = () => 'loggedInUID';

      let calledLogin = false;
      let calledActionFn = false;
      let calledHandleDeny = false;

      const func = CanHOF({
        action: 'handleSomething',
        type: 'yes',
        handleLogin: () => { calledLogin = true; },
        handleAction: () => { calledActionFn = true; },
        handleDeny: () => { calledHandleDeny = true; },
      })();

      expect(calledActionFn).to.equal(true);
      expect(calledLogin).to.equal(false);
      expect(calledHandleDeny).to.equal(false);
    });

    it('should call handle deny when not allowed to perform action ', () => {
      Meteor.userId = () => 'loggedInUID';

      let calledLogin = false;
      let calledActionFn = false;
      let calledHandleDeny = false;

      const func = CanHOF({
        action: 'handleSomething',
        type: 'no',
        handleLogin: () => { calledLogin = true; },
        handleAction: () => { calledActionFn = true; },
        handleDeny: () => { calledHandleDeny = true; },
      })();

      expect(calledActionFn).to.equal(false);
      expect(calledLogin).to.equal(false);
      expect(calledHandleDeny).to.equal(true);
    });
  });
}
