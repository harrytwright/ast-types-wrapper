const { builders: b, namedTypes: n } = require('ast-types')
const k = require('ast-types/gen/kinds')

const { identifier } = require('../utils')

function spread(key) {
  return b.spreadElement(identifier(key))
}

module.exports = {
  spread
}
