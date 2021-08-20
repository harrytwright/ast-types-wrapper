const { builders: b, namedTypes: n } = require('ast-types')
const k = require('ast-types/gen/kinds')

const { identifier, literal } = require('../utils')
const { pattern } = require('../object/object')

/***
 * CONST
 * */

/**
 * Create a constant
 *
 * ```
 * const name = value
 * ```
 *
 * @param {string|k.ExpressionKind} name
 * @param {string|k.LiteralKind|k.ExpressionKind} value
 *
 * @returns {k.VariableDeclarationKind}
 * */
function constant (name, value) {
  return constantChainable(declarator(name, value))
}

/**
 * Create a chained constant
 *
 * * ```
 * const name = value,
 *  value = name
 * ```
 *
 * @param {k.VariableDeclaratorKind | k.IdentifierKind} declarator
 *
 * @returns {k.VariableDeclarationKind}
 * */
const constantChainable = constant.chainable = function (...declarator) {
  return declaration('const', [...declarator])
}

/**
 * Create a destructed object constant
 *
 * @param {string|k.ExpressionKind} value
 * @param {k.ObjectExpressionKind|k.PropertyKind} property
 *
 * @returns {k.VariableDeclarationKind}
 * */
constant.destructuring = function (value, ...property) {
  return destructuring(constant, value, ...property)
}

/***
 * VAR
 * */

/**
 * Create a variable
 *
 * ```
 * var name = value
 * ```
 *
 * @param {string|k.ExpressionKind} name
 * @param {string|k.LiteralKind|k.ExpressionKind} value
 *
 * @returns {k.VariableDeclarationKind}
 * */
function variable (name, value) {
  return variableChainable(declarator(name, value))
}

/**
 * Create a chained variable
 *
 * * ```
 * var name = value,
 *  value = name
 * ```
 *
 * @param {k.VariableDeclaratorKind | k.IdentifierKind} declarator
 *
 * @returns {k.VariableDeclarationKind}
 * */
const variableChainable = variable.chainable = function (...declarator) {
  return declaration('var', [...declarator])
}

/**
 * Create a destructed object constant
 *
 * @param {string|k.ExpressionKind} value
 * @param {k.ObjectExpressionKind|k.PropertyKind} property
 *
 * @returns {k.VariableDeclarationKind}
 * */
variable.destructuring = function (value, ...property) {
  return destructuring(variable, value, ...property)
}

/***
 * LET
 * */

/**
 * Create a scoped variable
 *
 * ```
 * let name = value
 * ```
 *
 * @param {string|k.ExpressionKind} name
 * @param {string|k.LiteralKind|k.ExpressionKind} value
 *
 * @returns {k.VariableDeclarationKind}
 * */
function scoped (name, value) {
  return scopedChainable(declarator(name, value))
}

/**
 * Create a scoped chained variable
 *
 * * ```
 * let name = value,
 *  value = name
 * ```
 *
 * @param {k.VariableDeclaratorKind | k.IdentifierKind} declarator
 *
 * @returns {k.VariableDeclarationKind}
 * */
const scopedChainable = scoped.chainable = function (...declarator) {
  return declaration('let', [...declarator])
}

/**
 * Create a destructed object constant
 *
 * @param {string|k.ExpressionKind} value
 * @param {k.ObjectExpressionKind|k.PropertyKind} property
 *
 * @returns {k.VariableDeclarationKind}
 * */
scoped.destructuring = function (value, ...property) {
  return destructuring(scoped, value, ...property)
}

/***
 * UTILS
 * */

/**
 * Create a basic declarator
 *
 * @param {string|k.ExpressionKind} name
 * @param {string|k.LiteralKind|k.ExpressionKind} value
 *
 * @returns {k.VariableDeclaratorKind | k.IdentifierKind}
 * */
function declarator (name, value) {
  return b.variableDeclarator(identifier(name), literal(value))
}

/**
 * Create the declaration
 *
 * @param {'var'|'let'|'const'} kind
 * @param {Array<k.VariableDeclaratorKind | k.IdentifierKind>} declarators
 *
 * @returns {k.VariableDeclarationKind}
 * */
function declaration (kind, declarators) {
  return b.variableDeclaration(kind, declarators)
}

// Just a wrapper for the destructuring calls
//
// Think this is self explanatory
function destructuring (func, value, ...property) {
  return func(pattern.withProperties(...property), literal(value))
}

module.exports = {
  scoped,
  constant,
  variable,
  declarator
}
