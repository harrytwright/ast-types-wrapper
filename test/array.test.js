const chai = require('chai')
const recast = require('recast')
const { namedTypes: n, builders: b } = require('ast-types')

const assert = chai.assert

const { array, spread } = require('../src/array')
const { property } = require("../src/object");

// TODO: Maybe add more tests?? But these cover the basis
describe('object', function () {
  it('should create an array using an array', function () {
    const arr = array([1, 2, 3, 4])

    assert(n.ArrayExpression.check(arr), 'arr is an Array')
  });

  it('should create an array using an arrangement of elements', function () {
    const arr = array([1, { key: 'value' }, true, ['1', '2', 3, { key: { key: 'value' } }]])

    assert(n.ArrayExpression.check(arr), 'arr is an Array')
  });

  it('should create an array using an array with custom properties', function () {
    const arr = array.withProperties(
      spread('args')
    )

    assert(n.ArrayExpression.check(arr), 'arr is an Array')
  });
});
