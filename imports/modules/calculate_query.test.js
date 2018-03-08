import { CalculateQuery } from '/imports/modules/calculate_query';

const { expect } = chai;

describe('Calculate Query', function () {
  it('should throw error if query helper used was not defined', function () {
    let called = false;
    console.error = () => { called = true; };
    CalculateQuery({}, ['not-defined'], {});
    expect(called).to.equal(true);
  });

  it('should resolve multiple helpers correctly', function () {
    const helperDefs = {
      query() {
        return [{ test: 'hello' }, {}, {}];
      },
      query2() {
        return [{ test2: 'hello' }, {}, {}];
      },
    };
    const query = CalculateQuery(helperDefs, ['query', 'query2'], {});

    const expected = [{
      $and: [{
        test: 'hello',
      }, {
        test2: 'hello',
      }],
    }, {}, {}];
    expect(query).to.deep.equal(expected);
  });

  it('should not error if 2 helpers modify the same key with same value', function () {
    let called = false;
    console.error = () => { called = true; };
    const helperDefs = {
      query() {
        return [{ test: 'hello' }, {}, {}];
      },
      query2() {
        return [{ test: 'hello' }, {}, {}];
      },
    };
    CalculateQuery(helperDefs, ['query', 'query2'], {});
    expect(called).to.equal(false);
  });

  it('should calculate multiple $or keys combined correctly', function () {
    let called = false;
    console.error = () => { called = true; };
    const helperDefs = {
      h1() {
        return [{ $or: [{ t: '1' }, { t: '2' }] }, {}, {}];
      },
      h2() {
        return [{ $or: [{ t: '2' }, { t: '3' }] }, {}, {}];
      },
      h3() {
        return [{ $or: [{ t: '3' }, { t: '4' }] }, {}, {}];
      },
      h4() {
        return [{}, {}, {}];
      },
    };

    // Overly brittle since we don't care about the output $or ordering
    const expected = [{
      $and: [{
        $or: [{ t: '1' }, { t: '2' }],
      }, {
        $or: [{ t: '2' }, { t: '3' }],
      }, {
        $or: [{ t: '3' }, { t: '4' }],
      }],
    }, {}, {}];

    const query = CalculateQuery(helperDefs, ['h1', 'h2', 'h3', 'h4'], {});
    expect(called).to.equal(false);
    expect(JSON.stringify(query)).to.equal(JSON.stringify(expected));
  });

  it('should calculate multiple $and keys combined correctly', function () {
    let called = false;
    console.error = () => { called = true; };
    const helperDefs = {
      h1() {
        return [{ $and: [{ t: '1' }, { t: '2' }] }, {}, {}];
      },
      h2() {
        return [{ $or: [{ t: '2' }, { t: '3' }] }, {}, {}];
      },
    };

    // Overly brittle since we don't care about the output $or ordering
    const expected = [{
      $and: [{
        t: '1',
      }, {
        t: '2',
      }, {
        $or: [{ t: '2' }, { t: '3' }],
      }],
    }, {}, {}];

    const query = CalculateQuery(helperDefs, ['h1', 'h2'], {});
    expect(called).to.equal(false);
    expect(JSON.stringify(query)).to.equal(JSON.stringify(expected));
  });
});
