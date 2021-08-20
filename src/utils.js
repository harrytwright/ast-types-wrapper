/**
 * This is for any global functions used by multiple files
 * */

const { builders: b, namedTypes: n } = require('ast-types')
const k = require('ast-types/gen/kinds')

/**
 * Create an identifier or return if the value is an Identifier or Expression
 *
 * @param {string|k.ExpressionKind} value
 *
 * @returns {k.ExpressionKind}
 * @throws
 * */
function identifier (value) {
  if (n.Identifier.check(value) || n.Expression.check(value) || n.Pattern.check(value)) return value
  if (typeof value === 'string') return b.identifier(value)
  throw new Error('Invalid identifier type: ' + value)
}

/**
 * Create a literal or return if the value is an Identifier or Expression
 *
 * @param {string|k.ExpressionKind} value
 *
 * @returns {k.ExpressionKind}
 * @throws
 * */
function literal (value) {
  if (n.Identifier.check(value) || n.Expression.check(value) || n.Literal.check(value)) return value
  return b.literal(value)
}

module.exports = {
  identifier,
  literal
}
