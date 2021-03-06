const { namedTypes: n, builders: b } = require('ast-types')

const { array, spread } = require('../src/array')

// TODO: Maybe add more tests?? But these cover the basis
describe('object', () => {
  it('should create an array using an array', () => {
    const arr = array([1, 2, 3, 4])

    expect(arr).toMatchSnapshot()
    expect(n.ArrayExpression.check(arr)).toBeTruthy()
  });

  it('should create an array using an arrangement of elements', () => {
    const arr = array([1, { key: 'value' }, true, ['1', '2', 3, { key: { key: 'value' } }]])

    expect(arr).toMatchSnapshot()
    expect(n.ArrayExpression.check(arr)).toBeTruthy()
  });

  it(
    'should create an array using an array with custom properties',
    () => {
      const arr = array.withProperties(
        spread('args')
      )

      expect(arr).toMatchSnapshot()
      expect(n.ArrayExpression.check(arr)).toBeTruthy()
    }
  );
});
