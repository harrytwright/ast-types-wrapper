/**
 * This is for require calls to work with constants
 * */

const { builders: b, namedTypes: n } = require('ast-types')
const k = require('ast-types/gen/kinds')

const { constant } = require('./utils')

const { identifier, literal } = require('../utils')
const { req: createRequire } = require('../functions')

/**
 * @callback CustomRequire
 *
 * @param {string|k.ExpressionKind} key
 * @param {string|k.LiteralKind} path
 *
 * @returns {k.VariableDeclarationKind}
 * */

/**
 * A simple handler for a require call
 *
 * @note uses `const`
 *
 * @param {string|k.ExpressionKind} key
 * @param {string|k.LiteralKind} path
 *
 * @returns {k.VariableDeclarationKind}
 * */
function req(key, path) {
  return customRequire(constant)(key, path)
}

/**
 * A simple handler for a require call when using a package
 *
 * @note uses `const`
 *
 * @param {string|k.ExpressionKind} pkg
 *
 * @returns {k.VariableDeclarationKind}
 * */
req.package = function (pkg) {
  return req(identifier(pkg), literal(pkg))
}

/**
 * Create a destructured import using const
 *
 * @param {string|k.ExpressionKind} pkgOrPath
 * @param {k.ObjectExpressionKind|k.PropertyKind} property
 *
 * @returns {k.VariableDeclarationKind}
 * */
req.destructuring = function (pkgOrPath, ...property) {
  return constant.destructuring(createRequire(pkgOrPath), ...property)
}

/**
 * Create a require using a variable function
 *
 * @param {Function} kind
 *
 * @returns {CustomRequire}
 * */
const customRequire = req.custom = (kind) => (key, path) => {
  // Not sure if we could check this to validate it's a correct type
  if (typeof kind !== 'function') throw new TypeError('Invalid type ' + typeof kind)
  return kind(identifier(key), createRequire(path))
}

/**
 * Node requires
 * */

// Import fs
req.fs = req.package('fs')

// Import path
req.path = req.package('path')

// Import os
req.os = req.package('os')

module.exports = {
  req
}
