const recast = require('recast')
const { namedTypes: n, builders: b } = require('ast-types')

const { property } = require('../src/object')
const { identifier } = require('../src/utils')
const { constant, variable, scoped, declarator, req } = require('../src/variable')

describe('variable.constant', () => {
  it('should create a constant', () => {
    const name = constant('name', 'value')

    expect(name).toMatchSnapshot()
    expect(n.VariableDeclaration.check(name)).toBeTruthy()
  })

  it('should create a constant with a identifier', () => {
    const name = constant('name', identifier('value'))
    expect(n.VariableDeclaration.check(name)).toBeTruthy()

    const code = recast.print(name).code
    expect(code).toEqual('const name = value;')
  })

  it('should work chainable', () => {
    const chained = constant.chainable(
      declarator('name', 'value'),
      declarator('value', 'name')
    )

    expect(n.VariableDeclaration.check(chained)).toBeTruthy()

    const code = recast.print(chained).code
    expect(code).toEqual('const name = "value", value = "name";')
  })

  it('should destruct objects', () => {
    const destruct = constant.destructuring(identifier('parent'),
      property.shorthand('shorthand'),
      property.spread('rest'),
    )

    expect(n.VariableDeclaration.check(destruct)).toBeTruthy()

    const code = recast.print(destruct, { tabWidth: 2 }).code
    // Pain in the ass but only way to test this w/out a file and fs patching
    const result = `
const {
  shorthand,
  ...rest
} = parent;
    `.replace('\n', '').trim()

    expect(code).toEqual(result)
  });
})

describe('variable.variable', () => {
  it('should create a constant', () => {
    const name = variable('name', 'value')

    expect(name).toMatchSnapshot()
    expect(n.VariableDeclaration.check(name)).toBeTruthy()
  })

  it('should create a constant with a identifier', () => {
    const name = variable('name', identifier('value'))
    expect(n.VariableDeclaration.check(name)).toBeTruthy()

    const code = recast.print(name).code
    expect(code).toEqual('var name = value;')
  })

  it('should work chainable', () => {
    const chained = variable.chainable(
      declarator('name', 'value'),
      declarator('value', 'name')
    )

    expect(n.VariableDeclaration.check(chained)).toBeTruthy()

    const code = recast.print(chained).code
    expect(code).toEqual('var name = "value", value = "name";')
  })

  it('should destruct objects', () => {
    const destruct = variable.destructuring(identifier('parent'),
      property.shorthand('shorthand'),
      property.spread('rest'),
    )

    expect(n.VariableDeclaration.check(destruct)).toBeTruthy()

    const code = recast.print(destruct, { tabWidth: 2 }).code
    // Pain in the ass but only way to test this w/out a file and fs patching
    const result = `
var {
  shorthand,
  ...rest
} = parent;
    `.replace('\n', '').trim()

    expect(code).toEqual(result)
  });
})

describe('variable.scoped', () => {
  it('should create a constant', () => {
    const name = scoped('name', 'value')

    expect(name).toMatchSnapshot()
    expect(n.VariableDeclaration.check(name)).toBeTruthy()
  })

  it('should create a constant with a identifier', () => {
    const name = scoped('name', identifier('value'))
    expect(n.VariableDeclaration.check(name)).toBeTruthy()

    const code = recast.print(name).code
    expect(code).toEqual('let name = value;')
  })

  it('should work chainable', () => {
    const chained = scoped.chainable(
      declarator('name', 'value'),
      declarator('value', 'name')
    )

    expect(n.VariableDeclaration.check(chained)).toBeTruthy()

    const code = recast.print(chained).code
    expect(code).toEqual('let name = "value", value = "name";')
  })

  it('should destruct objects', () => {
    const destruct = scoped.destructuring(identifier('parent'),
      property.shorthand('shorthand'),
      property.spread('rest'),
    )

    expect(n.VariableDeclaration.check(destruct)).toBeTruthy()

    const code = recast.print(destruct, { tabWidth: 2 }).code
    // Pain in the ass but only way to test this w/out a file and fs patching
    const result = `
let {
  shorthand,
  ...rest
} = parent;
    `.replace('\n', '').trim()

    expect(code).toEqual(result)
  });
})

describe('req', () => {
  it('should create a simple require constant', () => {
    const fs = req('fs', 'fs')
    expect(n.VariableDeclaration.check(fs)).toBeTruthy()

    const code = recast.print(fs).code
    expect(code).toEqual('const fs = require("fs");')
  });

  it('should require a package without passing name', () => {
    const fs = req.package('fs')
    expect(n.VariableDeclaration.check(fs)).toBeTruthy()

    const code = recast.print(fs).code
    expect(code).toEqual('const fs = require("fs");')
  });

  it('should allow for custom scope', () => {
    const fs = req.custom(scoped)('fs', 'fs')
    expect(n.VariableDeclaration.check(fs)).toBeTruthy()

    const code = recast.print(fs).code
    expect(code).toEqual('let fs = require("fs");')
  });

  it('should throw for invalid scope', () => {
    expect(() => req.custom('Invalid')('fs', 'fs')).toThrow('Invalid type string')
    // assert.throw(() => req.custom('Invalid')('fs', 'fs'), TypeError, 'Invalid type string')
  });

  it('should allow for destructuring', () => {
    const destruct = req.destructuring('fs',
      property.shorthand('promises')
    )
    expect(n.VariableDeclaration.check(destruct)).toBeTruthy()

    const code = recast.print(destruct, { tabWidth: 2 }).code
    // Pain in the ass but only way to test this w/out a file and fs patching
    const result = `
const {
  promises
} = require("fs");
    `.replace('\n', '').trim()

    expect(code).toEqual(result)
  });
});
