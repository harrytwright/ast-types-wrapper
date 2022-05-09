const { builders: b, namedTypes: n } = require('ast-types')
const k = require('ast-types/gen/kinds')

const { identifier } = require('../utils')

// Very weird use-case
function UNSTABLE__add (arr, ...elements) {
  for (const element of [...elements]) {
    arr.elements.push(element)
  }
}

function spread(key) {
  return b.spreadElement(identifier(key))
}

module.exports = {
  spread, UNSTABLE__add
}
