const recast = require('recast')
const { namedTypes: n, builders: b } = require('ast-types')

const { member, computedMember, computedLiteralMember, property, object, pattern } = require('../src/object')

describe('object.member', () => {
  it('should create a member', () => {
    const dot = member('key', 'value')

    expect(dot).toMatchSnapshot()
    expect(n.MemberExpression.check(dot)).toBeTruthy()
  })

  it('should by variadic', () => {
    const dot = member('key', 'value', 'or', 'another', 'one')
    expect(n.MemberExpression.check(dot)).toBeTruthy()

    const code = recast.print(dot).code
    expect(code).toEqual('key.value.or.another.one')
  })

  it('should throw on an invalid member', () => {
    expect(() => member('key', 5)).toThrow('Invalid identifier type: ' + 5)
  })
})

describe('object.computedMember', () => {
  it('should create a member', () => {
    const square = computedMember('key', 'value')

    expect(square).toMatchSnapshot()
    expect(n.MemberExpression.check(square)).toBeTruthy()
  })

  it('should throw on invalid method', () => {
    expect(() => computedMember('key', 5)).toThrow('Invalid identifier type: ' + 5)
  })

  it('should by variadic', () => {
    const square = computedMember('key', 'value', 'or', 'another', 'one')
    expect(n.MemberExpression.check(square)).toBeTruthy()

    const code = recast.print(square).code
    expect(code).toEqual('key[value][or][another][one]')
  })
})

describe('object.computedLiteralMember', () => {
  it('should create a member', () => {
    const square = computedLiteralMember('key', 'value')

    expect(square).toMatchSnapshot()
    expect(n.MemberExpression.check(square)).toBeTruthy()
  })

  it('should by variadic', () => {
    const square = computedLiteralMember('key', 'value', 'or', 'another', 'one', 5)
    expect(n.MemberExpression.check(square)).toBeTruthy()

    const code = recast.print(square).code
    expect(code).toEqual('key["value"]["or"]["another"]["one"][5]')
  })
})

describe('property', () => {
  it('should create a simple property', () => {
    const prop = property('key', 'value')

    expect(prop).toMatchSnapshot()
    expect(n.Property.check(prop)).toBeTruthy()
  });

  it('should create a simple property with valid code', () => {
    const prop = property('key', 'value')
    expect(n.Property.check(prop)).toBeTruthy()

    const code = recast.print(prop).code
    expect(code).toEqual('key: "value"')
  });
});

// TODO: Maybe add more tests?? But these cover the basis
describe('object', () => {
  it('should create an object using an object', () => {
    const obj = object({
      key: 'value'
    })

    expect(obj).toMatchSnapshot()
    expect(n.ObjectExpression.check(obj)).toBeTruthy()
  });

  it('should create a deep object', () => {
    const obj = object({
      key: {
        key: {
          key: 'value'
        }
      }
    })

    expect(obj).toMatchSnapshot()
    expect(n.ObjectExpression.check(obj)).toBeTruthy()
  });

  it('should create a deep object with array', () => {
    const obj = object({
      key: {
        key: {
          key: [1, { key: 'value' }, true, ['1', '2', 3, { key: { key: 'value' } }]]
        }
      }
    })

    expect(obj).toMatchSnapshot()
    expect(n.ObjectExpression.check(obj)).toBeTruthy()
  });

  it(
    'should create an object using an object with custom properties',
    () => {
      const obj = object.withProperties(
        property.spread('args')
      )

      expect(obj).toMatchSnapshot()
      expect(n.ObjectExpression.check(obj)).toBeTruthy()
    }
  );
});

describe('pattern', () => {
  it('should create an object using an object', () => {
    const obj = pattern({
      key: 'value'
    })

    expect(obj).toMatchSnapshot()
    expect(n.ObjectPattern.check(obj)).toBeTruthy()
  });

  it(
    'should create an object using an object with custom properties',
    () => {
      const obj = pattern.withProperties(
        property.spread('args')
      )

      expect(obj).toMatchSnapshot()
      expect(n.ObjectPattern.check(obj)).toBeTruthy()
    }
  );
});
