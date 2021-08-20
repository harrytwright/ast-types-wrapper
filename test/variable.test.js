const chai = require('chai')
const recast = require('recast')
const { namedTypes: n, builders: b } = require('ast-types')

const assert = chai.assert

const { property } = require('../src/object')
const { identifier } = require('../src/utils')
const { constant, variable, scoped, declarator, req } = require('../src/variable')

describe('variable.constant', function () {
  it('should create a constant', function () {
    const name = constant('name', 'value')
    assert(n.VariableDeclaration.check(name), 'name is VariableDeclaration')
  })

  it('should create a constant with a identifier', function () {
    const name = constant('name', identifier('value'))
    assert(n.VariableDeclaration.check(name), 'name is VariableDeclaration')

    const code = recast.print(name).code
    assert(code === 'const name = value;', 'Should turn name into an constant')
  })

  it('should work chainable', function () {
    const chained = constant.chainable(
      declarator('name', 'value'),
      declarator('value', 'name')
    )

    assert(n.VariableDeclaration.check(chained), 'name is VariableDeclaration')

    const code = recast.print(chained).code
    assert(code === 'const name = "value", value = "name";', 'Should turn chained into a chained constant')
  })

  it('should destruct objects', function () {
    const destruct = constant.destructuring(identifier('parent'),
      property.shorthand('shorthand'),
      property.spread('rest'),
    )

    assert(n.VariableDeclaration.check(destruct), 'destruct is VariableDeclaration')

    const code = recast.print(destruct, { tabWidth: 2 }).code
    // Pain in the ass but only way to test this w/out a file and fs patching
    const result = `
const {
  shorthand,
  ...rest
} = parent;
    `.replace('\n', '').trim()

    assert(code === result, 'Should turn destruct into a destructed VariableDeclaration')
  });
})

describe('variable.variable', function () {
  it('should create a constant', function () {
    const name = variable('name', 'value')
    assert(n.VariableDeclaration.check(name), 'name is VariableDeclaration')
  })

  it('should create a constant with a identifier', function () {
    const name = variable('name', identifier('value'))
    assert(n.VariableDeclaration.check(name), 'name is VariableDeclaration')

    const code = recast.print(name).code
    assert(code === 'var name = value;', 'Should turn name into an constant')
  })

  it('should work chainable', function () {
    const chained = variable.chainable(
      declarator('name', 'value'),
      declarator('value', 'name')
    )

    assert(n.VariableDeclaration.check(chained), 'name is VariableDeclaration')

    const code = recast.print(chained).code
    assert(code === 'var name = "value", value = "name";', 'Should turn chained into a chained constant')
  })

  it('should destruct objects', function () {
    const destruct = variable.destructuring(identifier('parent'),
      property.shorthand('shorthand'),
      property.spread('rest'),
    )

    assert(n.VariableDeclaration.check(destruct), 'destruct is VariableDeclaration')

    const code = recast.print(destruct, { tabWidth: 2 }).code
    // Pain in the ass but only way to test this w/out a file and fs patching
    const result = `
var {
  shorthand,
  ...rest
} = parent;
    `.replace('\n', '').trim()

    assert(code === result, 'Should turn destruct into a destructed VariableDeclaration')
  });
})

describe('variable.scoped', function () {
  it('should create a constant', function () {
    const name = scoped('name', 'value')
    assert(n.VariableDeclaration.check(name), 'name is VariableDeclaration')
  })

  it('should create a constant with a identifier', function () {
    const name = scoped('name', identifier('value'))
    assert(n.VariableDeclaration.check(name), 'name is VariableDeclaration')

    const code = recast.print(name).code
    assert(code === 'let name = value;', 'Should turn name into an constant')
  })

  it('should work chainable', function () {
    const chained = scoped.chainable(
      declarator('name', 'value'),
      declarator('value', 'name')
    )

    assert(n.VariableDeclaration.check(chained), 'name is VariableDeclaration')

    const code = recast.print(chained).code
    assert(code === 'let name = "value", value = "name";', 'Should turn chained into a chained constant')
  })

  it('should destruct objects', function () {
    const destruct = scoped.destructuring(identifier('parent'),
      property.shorthand('shorthand'),
      property.spread('rest'),
    )

    assert(n.VariableDeclaration.check(destruct), 'destruct is VariableDeclaration')

    const code = recast.print(destruct, { tabWidth: 2 }).code
    // Pain in the ass but only way to test this w/out a file and fs patching
    const result = `
let {
  shorthand,
  ...rest
} = parent;
    `.replace('\n', '').trim()

    assert(code === result, 'Should turn destruct into a destructed VariableDeclaration')
  });
})

describe('req', function () {
  it('should create a simple require constant', function () {
    const fs = req('fs', 'fs')
    assert(n.VariableDeclaration.check(fs), 'fs is VariableDeclaration')

    const code = recast.print(fs).code
    assert(code === 'const fs = require("fs");', 'Should create a default require call')
  });

  it('should require a package without passing name', function () {
    const fs = req.package('fs')
    assert(n.VariableDeclaration.check(fs), 'fs is VariableDeclaration')

    const code = recast.print(fs).code
    assert(code === 'const fs = require("fs");', 'Should create a default require call')
  });

  it('should allow for custom scope', function () {
    const fs = req.custom(scoped)('fs', 'fs')
    assert(n.VariableDeclaration.check(fs), 'fs is VariableDeclaration')

    const code = recast.print(fs).code
    assert(code === 'let fs = require("fs");', 'Should create a default require call')
  });

  it('should throw for invalid scope', function () {
    assert.throw(() => req.custom('Invalid')('fs', 'fs'), TypeError, 'Invalid type string')
  });

  it('should allow for destructuring', function () {
    const destruct = req.destructuring('fs',
      property.shorthand('promises')
    )
    assert(n.VariableDeclaration.check(destruct), 'destruct is VariableDeclaration')

    const code = recast.print(destruct, { tabWidth: 2 }).code
    // Pain in the ass but only way to test this w/out a file and fs patching
    const result = `
const {
  promises
} = require("fs");
    `.replace('\n', '').trim()

    assert(code === result, 'Should turn destruct into a destructed VariableDeclaration')
  });
});
