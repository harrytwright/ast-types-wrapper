# Types-Wrapper

> This is a simple wrapper for [ast-types](https://github.com/benjamn/ast-types)

## TODO

> For a 0.0.1 release

- [x] utils
    - [x] literals
    - [x] identifier
- [ ] variable
    - [x] constant
    - [x] scoped
    - [x] variables
    - [x] chaining
    - [ ] destructuring (For all)
      - [x] object
      - [ ] array
    - [X] Custom common variables
        - [X] require
          - [X] generic
          - [X] node requirements
- [ ] object
    - [x] creation
    - [ ] getting
    - [ ] constructor
    - [ ] prototyping
    - [ ] inheritance ?? w/out require of `utils.inherit`
- [ ] function
    - [ ] class methods
    - [X] functions
    - [ ] blocks
    - [ ] common functions
        - [ ] node

## API

### Variables

#### constants

Create a constant

> Please note that the value passed will be turned into a literal if it is not an `ExpressionKind`

```javascript
const {identifier} = require('@harrytwright/ast-types-wrapper/utils')
const {constant, declarator} = require('@harrytwright/ast-types-wrapper/variable')

let object = constant('idx', 5) // const idx = 5;
object = constant('key', identifier('value')) // const key = value;
object = constant.chainable(
  declarator('key', 5),
  declarator('hello', 'world')
) // const key = 5, hello = 'world';

// Also constant contains a special method
const {property} = require('@harrytwright/ast-types-wrapper/object')
object = constant.destructuring('key', property.shorthand('name'), property.spread('...rest'))
```

#### variable

Create a variable

> Please note that the value passed will be turned into a literal if it is not an `ExpressionKind`

```javascript
const {identifier} = require('@harrytwright/ast-types-wrapper/utils')
const {variable, declarator} = require('@harrytwright/ast-types-wrapper/variable')

let object = variable('idx', 5) // var idx = 5;
object = variable('key', identifier('value')) // var key = value;
object = variable.chainable(
  declarator('key', 5),
  declarator('hello', 'world')
) // var key = 5, hello = 'world';
```

#### scoped

Create a scoped variable `let`

> Please note that the value passed will be turned into a literal if it is not an `ExpressionKind`

```javascript
const {identifier} = require('@harrytwright/ast-types-wrapper/utils')
const {scoped, declarator} = require('@harrytwright/ast-types-wrapper/variable')

let object = scoped('idx', 5) // let idx = 5;
object = scoped('key', identifier('value')) // let var = value;
object = scoped.chainable(
  declarator('key', 5),
  declarator('hello', 'world')
) // let key = 5, hello = 'world';
```

#### declarator

This is the wrapper for `b.variableDeclarator`

```javascript
const {identifier} = require('@harrytwright/ast-types-wrapper/utils')
const {declarator} = require('@harrytwright/ast-types-wrapper/variable')

let object = declarator('idx', 5) // idx = 5
object = declarator('key', identifier('value')) // var = value
```

### Object

#### object

These are functions to help create objects

```javascript
const {identifier} = require('@harrytwright/ast-types-wrapper/utils')
const {object, property} = require('@harrytwright/ast-types-wrapper/object')

// Pass a standard object and it will be converted with key->identifier, value->literal|Node
let obj = object({
  key: 'value'
}) // { key: 'value' } 

// Or if you want more customisation
obj = object.withProperties(
  property.spread('spread'),
  property('key', 'value')
) // { spread..., key: 'value' } 
```

#### pattern

These are functions to help create an object pattern for a vanilla JS object

These are used internally by const when destructuring an object

```javascript
const {identifier} = require('@harrytwright/ast-types-wrapper/utils')
const {pattern, property} = require('@harrytwright/ast-types-wrapper/object')

// Pass a standard object and it will be converted with key->identifier, value->literal|Node
let obj = pattern({
  key: 'value'
}) // { key: 'value' } 

// Or if you want more customisation
obj = pattern.withProperties(
  property.spread('spread'),
  property('key', 'value')
) // { spread..., key: 'value' } 
```
