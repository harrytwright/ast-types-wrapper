const assert = require('assert')

const { builders: b, namedTypes: n } = require('ast-types')
const k = require('ast-types/gen/kinds')

const { literal }  = require("../utils");
const { property } = require("../object/utils");

function array(elements) {
  assert.equal(Array.isArray(elements), true)

  // This is needed to prevent circular deps
  const onObject = (obj) => {
    const properties = []

    Object.keys(obj).forEach((key) => {
      switch (typeof obj[key]) {
        case "object":
          if (Array.isArray(obj[key])) {
            properties.push(property(key, array(obj[key])))
          } else {
            properties.push(property(key, onObject(obj[key])))
          }
          break
        default:
          properties.push(property(key, literal(obj[key])))
      }
    })

    return b.objectExpression(properties)
  }

  return b.arrayExpression(elements.map(element => {
    switch (typeof element) {
      case "object":
        if (Array.isArray(element)) return array(element)
        return onObject(element)
      default:
        return literal(element)
    }
  }))
}

array.withProperties = function (...elements) {
  return b.arrayExpression([...elements])
}

module.exports = {
  array
}
