const { builders: b, namedTypes: n } = require('ast-types')
const k = require('ast-types/gen/kinds')

const { identifier, literal } = require('../utils')

// Very weird use-case
function UNSTABLE__merge (object, ...elements) {
  for (const element of [...elements]) {
    object.properties = object.properties.concat(
      element.properties
    )
  }
}

/**
 * Create a standard object property
 *
 * ```
 * {
 *   key: 'value',
 * }
 * ```
 *
 * @param {string|k.ExpressionKind} key
 * @param {string|k.ExpressionKind|k.LiteralKind} value
 *
 * @returns {k.ObjectExpressionKind}
 * @throws
 * */
function property (key, value) {
  return _property(key, literal(value), false)
}

/**
 * Create a shorthand object property
 *
 * ```
 * {
 *   key,
 * }
 * ```
 *
 * @param {string|k.ExpressionKind} key
 * @returns {k.ObjectExpressionKind}
 * @throws
 * */
property.shorthand = function (key) {
  return _property(identifier(key), identifier(key), true)
}

/**
 * Create a spread property
 *
 * ```
 * {
 *   ...key,
 * }
 * ```
 *
 * @param {string|k.ExpressionKind} key
 * @returns {k.ObjectExpressionKind}
 * @throws
 * */
property.spread = function (key) {
  return b.spreadProperty(identifier(key))
}

/**
 * The base wrapper for `b.property`
 *
 * @param {string|k.ExpressionKind} key
 * @param {string|k.ExpressionKind|k.LiteralKind} value
 * @param {Boolean} shorthand
 * */
function _property (key, value, shorthand) {
  return b.property.from({
    kind: 'init',
    value: literal(value),
    key: identifier(key),
    shorthand
  })
}

module.exports = {
  property,
  UNSTABLE__merge
}
