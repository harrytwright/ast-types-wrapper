const chai = require('chai')
const recast = require('recast')
const { namedTypes: n, builders: b } = require('ast-types')

const assert = chai.assert

const { member, computedMember, computedLiteralMember, property, object, pattern } = require('../src/object')

describe('object.member', function () {
  it('should create a member', function () {
    const dot = member('key', 'value')
    assert(n.MemberExpression.check(dot), 'dot is a dot-notation')
  })

  it('should by variadic', function () {
    const dot = member('key', 'value', 'or', 'another', 'one')
    assert(n.MemberExpression.check(dot), 'dot is a dot-notation')

    const code = recast.print(dot).code
    assert(code === 'key.value.or.another.one', 'Should align the members in order')
  })

  it('should throw on an invalid member', function () {
    assert.throw(() => member('key', 5), Error, 'Invalid identifier type: ' + 5)
  })
})

describe('object.computedMember', function () {
  it('should create a member', function () {
    const square = computedMember('key', 'value')
    assert(n.MemberExpression.check(square), 'square is square-notation')
  })

  it('should throw on invalid method', function () {
    assert.throw(() => computedMember('key', 5), Error, 'Invalid identifier type: ' + 5)
  })

  it('should by variadic', function () {
    const square = computedMember('key', 'value', 'or', 'another', 'one')
    assert(n.MemberExpression.check(square), 'dot is a square-notation')

    const code = recast.print(square).code
    assert(code === 'key[value][or][another][one]', 'Should align the members in order')
  })
})

describe('object.computedLiteralMember', function () {
  it('should create a member', function () {
    const square = computedLiteralMember('key', 'value')
    assert(n.MemberExpression.check(square), 'square is square-notation')
  })

  it('should by variadic', function () {
    const square = computedLiteralMember('key', 'value', 'or', 'another', 'one', 5)
    assert(n.MemberExpression.check(square), 'dot is a square-notation')

    const code = recast.print(square).code
    assert(code === 'key["value"]["or"]["another"]["one"][5]', 'Should align the members in order')
  })
})

describe('property', function () {
  it('should create a simple property', function () {
    const prop = property('key', 'value')
    assert(n.Property.check(prop), 'prop is a property')
  });

  it('should create a simple property with valid code', function () {
    const prop = property('key', 'value')
    assert(n.Property.check(prop), 'prop is a property')

    const code = recast.print(prop).code
    assert(code === 'key: "value"', 'Should create default property')
  });
});

// TODO: Maybe add more tests?? But these cover the basis
describe('object', function () {
  it('should create an object using an object', function () {
    const obj = object({
      key: 'value'
    })

    assert(n.ObjectExpression.check(obj), 'obj is an object')
  });

  it('should create an object using an object with custom properties', function () {
    const obj = object.withProperties(
      property.spread('args')
    )

    assert(n.ObjectExpression.check(obj), 'obj is an object')
  });
});

describe('pattern', function () {
  it('should create an object using an object', function () {
    const obj = pattern({
      key: 'value'
    })

    assert(n.ObjectPattern.check(obj), 'obj is an object')
  });

  it('should create an object using an object with custom properties', function () {
    const obj = pattern.withProperties(
      property.spread('args')
    )

    assert(n.ObjectPattern.check(obj), 'obj is an object')
  });
});
