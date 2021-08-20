/**
 * This is for any global functions used to manipulate object
 * */

const { builders: b, namedTypes: n } = require('ast-types')
const k = require('ast-types/gen/kinds')

const { func } = require('./utils')
const { literal } = require('../utils')

/**
 * Create a require function with the path
 *
 * @param {string|k.LiteralKind|k.ExpressionKind} path
 * @returns {k.ExpressionKind}
 * */
function req (path) {
  return func('require', literal(path))
}

module.exports = {
  req
}
