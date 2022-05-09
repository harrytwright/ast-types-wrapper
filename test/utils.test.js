const recast = require('recast')
const { namedTypes: n, builders: b } = require('ast-types')

const { identifier } = require('../src/utils')

describe('utils.identifier', () => {
  it('should create an identifier', () => {
    const name = identifier('name')

    expect(name).toMatchSnapshot()
    expect(n.Identifier.check(name)).toBeTruthy()
  })

  it('should use a passed identifier', () => {
    const builtName = b.identifier('name')
    const name = identifier(builtName)

    expect(builtName).toEqual(name)
  })

  it('should throw an error', () => {
    expect(() => identifier(5)).toThrow('Invalid identifier type: ' + 5)
  })

  it('should prints properly', () => {
    const code = recast.print(identifier('name')).code
    expect(code).toEqual('name')
  })
})
