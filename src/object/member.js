/**
 * This is for any global functions used to manipulate object
 * */

const { builders: b, namedTypes: n } = require('ast-types')
const k = require('ast-types/gen/kinds')

const { identifier, literal } = require('../utils')

/**
 * Create a dot-notation member
 *
 * ```
 * member.method().value.thing
 * ```
 *
 * @param {string|k.ExpressionKind} klass
 * @param {string|k.ExpressionKind} method
 *
 * @returns {k.ExpressionKind}
 * @throws
 * */
function member (klass, ...method) {
  return _member(klass, [...method], false)
}

/**
 * Create a bracket-notation member
 *
 * ```
 * member[method][another]
 * ```
 *
 * @param {string|k.ExpressionKind} klass
 * @param {string|k.ExpressionKind} method
 *
 * @returns {k.ExpressionKind}
 * @throws
 * */
function computedMember (klass, ...method) {
  return _member(klass, [...method].map(identifier), true)
}

/**
 * Create a bracket-notation member, using literal
 *
 * ```
 * member[5]["hello"]
 * ```
 *
 * @param {string|k.ExpressionKind} klass
 * @param {string|boolean|null|number|k.ExpressionKind} method
 *
 * @returns {k.ExpressionKind}
 * @throws
 * */
function computedLiteralMember (klass, ...method) {
  return _member(klass, [...method].map(literal), true)
}

/**
 * Create a member with as many members via dot notation or bracket notation
 *
 * @param {string|k.ExpressionKind} klass
 * @param {Array<string|k.ExpressionKind>} methods
 * @param {Boolean} computed
 *
 * @returns {k.ExpressionKind}
 * @throws
 * @private
 * */
function _member (klass, methods, computed) {
  const mutatedMethods = [...methods]

  // Just need the initial one
  const startingDot = mutatedMethods.shift()
  let expression = b.memberExpression(identifier(klass), identifier(startingDot), computed)

  mutatedMethods.forEach((method) => {
    expression = b.memberExpression(expression, identifier(method), computed)
  })

  return expression
}

module.exports = {
  member,
  computedMember,
  computedLiteralMember
}
