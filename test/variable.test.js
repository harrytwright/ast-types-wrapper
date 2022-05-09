const recast = require('recast')
const { namedTypes: n, builders: b } = require('ast-types')

const { property } = require('../src/object')
const { identifier } = require('../src/utils')
const { constant, variable, scoped, declarator, req } = require('../src/variable')

describe('variable.constant', () => {
  it('should create a constant', () => {
    const name = constant('name', 'value')
    expect(n.VariableDeclaration.check(name)).toBeTruthy()
  })

  it('should create a constant with a identifier', () => {
    const name = constant('name', identifier('value'))
    expect(n.VariableDeclaration.check(name)).toBeTruthy()

    const code = recast.print(name).code
    expect(code === 'const name = value;').toBeTruthy()
  })

  it('should work chainable', () => {
    const chained = constant.chainable(
      declarator('name', 'value'),
      declarator('value', 'name')
    )

    expect(n.VariableDeclaration.check(chained)).toBeTruthy()

    const code = recast.print(chained).code
    expect(code === 'const name = "value", value = "name";').toBeTruthy()
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

    expect(code === result).toBeTruthy()
  });
})

describe('variable.variable', () => {
  it('should create a constant', () => {
    const name = variable('name', 'value')
    expect(n.VariableDeclaration.check(name)).toBeTruthy()
  })

  it('should create a constant with a identifier', () => {
    const name = variable('name', identifier('value'))
    expect(n.VariableDeclaration.check(name)).toBeTruthy()

    const code = recast.print(name).code
    expect(code === 'var name = value;').toBeTruthy()
  })

  it('should work chainable', () => {
    const chained = variable.chainable(
      declarator('name', 'value'),
      declarator('value', 'name')
    )

    expect(n.VariableDeclaration.check(chained)).toBeTruthy()

    const code = recast.print(chained).code
    expect(code === 'var name = "value", value = "name";').toBeTruthy()
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

    expect(code === result).toBeTruthy()
  });
})

describe('variable.scoped', () => {
  it('should create a constant', () => {
    const name = scoped('name', 'value')
    expect(n.VariableDeclaration.check(name)).toBeTruthy()
  })

  it('should create a constant with a identifier', () => {
    const name = scoped('name', identifier('value'))
    expect(n.VariableDeclaration.check(name)).toBeTruthy()

    const code = recast.print(name).code
    expect(code === 'let name = value;').toBeTruthy()
  })

  it('should work chainable', () => {
    const chained = scoped.chainable(
      declarator('name', 'value'),
      declarator('value', 'name')
    )

    expect(n.VariableDeclaration.check(chained)).toBeTruthy()

    const code = recast.print(chained).code
    expect(code === 'let name = "value", value = "name";').toBeTruthy()
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

    expect(code === result).toBeTruthy()
  });
})

describe('req', () => {
  it('should create a simple require constant', () => {
    const fs = req('fs', 'fs')
    expect(n.VariableDeclaration.check(fs)).toBeTruthy()

    const code = recast.print(fs).code
    expect(code === 'const fs = require("fs");').toBeTruthy()
  });

  it('should require a package without passing name', () => {
    const fs = req.package('fs')
    expect(n.VariableDeclaration.check(fs)).toBeTruthy()

    const code = recast.print(fs).code
    expect(code === 'const fs = require("fs");').toBeTruthy()
  });

  it('should allow for custom scope', () => {
    const fs = req.custom(scoped)('fs', 'fs')
    expect(n.VariableDeclaration.check(fs)).toBeTruthy()

    const code = recast.print(fs).code
    expect(code === 'let fs = require("fs");').toBeTruthy()
  });

  it('should throw for invalid scope', () => {
    assert.throw(() => req.custom('Invalid')('fs', 'fs'), TypeError, 'Invalid type string')
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

    expect(code === result).toBeTruthy()
  });
});
