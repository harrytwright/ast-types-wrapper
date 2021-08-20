const chai = require('chai')
const recast = require('recast')
const { namedTypes: n, builders: b } = require('ast-types')

const assert = chai.assert

const { member } = require('../src/object')
const { identifier } = require('../src/utils')
const { func, method } = require('../src/functions')

describe('func', function () {
  it('should create a callee for a function', function () {
    const globalFunction = func('global', identifier('hello'))
    assert(n.CallExpression.check(globalFunction), 'globalFunction should be a function')

    const code = recast.print(globalFunction).code
    assert(code === 'global(hello)', 'Should be a global function')
  });
});

describe('member', function () {
  it('should create a callee for a member', function () {
    const cwd = method('process', 'cwd')
    assert(n.CallExpression.check(cwd), 'cwd should be a function')

    const code = recast.print(cwd).code
    assert(code === 'process.cwd()', 'Should be a membered method')
  });
});

describe('require', function () {

});

