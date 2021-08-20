const chai = require('chai')
const recast = require('recast')
const { namedTypes: n, builders: b } = require('ast-types')

const assert = chai.assert

const { identifier } = require('../src/utils')

describe('utils.identifier', function () {
  it('should create an identifier', function () {
    const name = identifier('name')
    assert(n.Identifier.check(name), 'name is Identifier')
  })

  it('should use a passed identifier', function () {
    const builtName = b.identifier('name')
    const name = identifier(builtName)

    assert(builtName === name, 'name is same as builtName')
  })

  it('should throw an error', function () {
    assert.throw(() => identifier(5), Error, 'Invalid identifier type: ' + 5)
  })

  it('should prints properly', function () {
    const code = recast.print(identifier('name')).code
    assert(code === 'name', 'Should turn name into an identifier')
  })
})
