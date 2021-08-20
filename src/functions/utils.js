/**
 * This is for any global functions used to manipulate object
 * */

const { builders: b, namedTypes: n } = require('ast-types')
const k = require('ast-types/gen/kinds')

const { identifier } = require('../utils')
const { member } = require('../object/member')

/**
 * Create a function
 *
 * ```
 * require('path')
 * ```
 *
 * @param {string|k.ExpressionKind} method
 * @param {k.ExpressionKind} argument
 *
 * @returns {k.ExpressionKind}
 * */
function createFunction (method, ...argument) {
  return _method(identifier(method), [...argument])
}
/**
 * Create a function
 *
 * ```
 * module.require('path')
 * ```
 *
 * @param {string|k.ExpressionKind} klass
 * @param {string|k.ExpressionKind} method
 * @param {k.ExpressionKind} argument
 *
 * @returns {k.ExpressionKind}
 * @throws
 * */
function createMethod (klass, method, ...argument) {
  return _method(member(klass, method), [...argument])
}

/**
 * Create a method, just a simple wrapper for `b.callExpression`
 *
 * @param {k.ExpressionKind} method
 * @param {Array<k.ExpressionKind>} argumentsParams
 *
 * @returns {k.ExpressionKind}
 * @private
 * */
function _method (method, argumentsParams) {
  return b.callExpression(method, argumentsParams)
}

module.exports = {
  func: createFunction,
  method: createMethod
}
