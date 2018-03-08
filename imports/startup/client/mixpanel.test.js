/* eslint-env mocha */

import { Meteor } from 'meteor/meteor';
import { chai, assert, expect } from 'meteor/practicalmeteor:chai';
import { ReactiveVar } from 'meteor/reactive-var';
import { Tracker } from 'meteor/tracker';
import { Random } from 'meteor/random';
import { FlowRouter } from 'meteor/kadira:flow-router';

if (Meteor.isClient) {
  const { tagVisitor } = require('./mixpanel');
  const mixpanel = require('mixpanel-browser');

  describe('mixpanel', function () {
    beforeEach(function () {
      this.user = new ReactiveVar();
      this.userId = new ReactiveVar();
      Meteor.user = () => this.user.get();
      Meteor.userId = () => this.userId.get();

      this.identified = [];
      mixpanel.identify = (...props) => this.identified.push(props);

      this.people = [];
      mixpanel.people.set = (...props) => this.people.push(props);
      mixpanel.people.set_once = (...props) => this.people.push(props);

      this.register_once = [];
      mixpanel.register_once = (...props) => this.register_once.push(props);

      this.calls = [];
      Meteor.call = (...props) => this.calls.push(props);
    });

    it('should identify an anonymous user', function () {
      tagVisitor();

      expect(this.identified.length).to.equal(1);
      expect(this.identified[0][0]).to.equal(undefined);
    });

    it('should register and set refer a friend', function () {
      const raf = Random.id();
      FlowRouter.getQueryParam = (key) => {
        if (key === 'ls') { return 'lead-source'; }
        if (key === 'raf') { return raf; }
        return undefined;
      };
      tagVisitor();

      const expectedRaf = { raf };
      // we expect lead source to also be raf for this case
      const expectedLs = { leadSource: raf };

      expect(this.people.length).to.equal(2);
      expect(this.people[0][0]).to.deep.equal(expectedLs);
      expect(this.people[1][0]).to.deep.equal(expectedRaf);
    });

    it('should identify an user and set their details', function () {
      const created = new Date();
      const email = 'email@email.com';
      this.userId.set(Random.id());
      this.user.set({
        emails: [{ address: email }],
        created,
        profile: {
          name: 'name',
          firstName: 'fname',
          lastName: 'lname',
        },
      });
      const expected = {
        name: 'name',
        $first_name: 'fname',
        $last_name: 'lname',
        $created: created.toISOString(),
        $email: email,
      };
      tagVisitor();

      expect(this.identified.length).to.equal(1);
      expect(this.identified[0][0]).to.equal(undefined);
      expect(this.people.length).to.equal(1);
      expect(this.people[0][0]).to.deep.equal(expected);
    });

    it('should rerun the user logged in loop after user log\'s in', function () {
      let runCount = 0;
      Tracker.autorun(() => {
        tagVisitor();
        runCount++;
      });

      this.userId.set(Random.id());
      this.user.set({ profile: {} });
      Tracker.flush();
      expect(runCount).to.be.above(1);
    });
  });
}
