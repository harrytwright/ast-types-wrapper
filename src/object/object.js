const { builders: b, namedTypes: n } = require('ast-types')
const k = require('ast-types/gen/kinds')

const { property } = require('./utils')

const { literal } = require('../utils')

/**
 * Create an object from a vanilla JS object
 *
 * ```
 * {
 *   name: 'object'
 *  }
 * ```
 *
 * @note Please note that it will turn the value of the key to a literal if it's not a Node
 *
 * @param {Object} obj
 * @returns {k.ObjectExpressionKind}
 * */
function object (obj) {
  const properties = []

  Object.keys(obj).forEach((key) => {
    properties.push(property(key, literal(obj[key])))
  })

  return b.objectExpression(properties)
}

/**
 * Create an object by passing pre-made elements
 *
 * @see object
 *
 * @param {k.PropertyKind} property
 * @returns {k.ObjectExpressionKind}
 * @throws
 * */
object.withProperties = function (...property) {
  return b.objectExpression([...property])
}

/**
 * Create an object pattern for a vanilla JS object
 *
 * This is more useful for object destructuring
 *
 * ```
 * {
 *   name: 'object'
 *  }
 * ```
 *
 * @note Please note that it will turn the value of the key to a literal if it's not a Node
 *
 * @param {Object} obj
 * @returns {k.ObjectExpressionKind}
 * */
function pattern (obj) {
  const properties = []

  Object.keys(obj).forEach((key) => {
    properties.push(property(key, literal(obj[key])))
  })

  return b.objectPattern(properties)
}

/**
 * Create an object pattern for a vanilla JS object
 *
 * This is more useful for object destructuring
 *
 * @see pattern
 *
 * @param {k.PropertyKind} property
 * @returns {k.ObjectExpressionKind}
 * @throws
 * */
pattern.withProperties = function (...property) {
  return b.objectPattern([...property])
}

module.exports = {
  object,
  pattern
}
