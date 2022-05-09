const recast = require('recast')
const { namedTypes: n, builders: b } = require('ast-types')

const { identifier } = require('../src/utils')
const { func, method } = require('../src/functions')

describe('func', () => {
  it('should create a callee for a function', () => {
    const globalFunction = func('global', identifier('hello'))
    expect(n.CallExpression.check(globalFunction)).toBeTruthy()

    const code = recast.print(globalFunction).code
    expect(code).toEqual('global(hello)')
  });
});

describe('member', () => {
  it('should create a callee for a member', () => {
    const cwd = method('process', 'cwd')
    expect(n.CallExpression.check(cwd)).toBeTruthy()

    const code = recast.print(cwd).code
    expect(code).toEqual('process.cwd()')
  });
});

// TODO
xdescribe('require', () => {

});

