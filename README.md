
[![NPM version][npm-version-image]][npm-url]
[![NPM downloads][npm-downloads-image]][npm-url]
[![MIT License][license-image]][license-url]
[![js-standard-style][standard-style-image]][standard-style-url]
[![Build Status: Linux][travis-image]][travis-url]
[![Build Status: Windows][appveyor-image]][appveyor-url]
[![Coverage Status][coveralls-image]][coveralls-url]


# 2valid

### JavaScript simple data validator

 v2.3.1


## Installation
```npm install --save 2valid```


## Usage ( simple example )

Check for integer

```javascript
var v = require('2valid');
console.log( v.validate('integer', 111) ); //null 
console.log( v.validate('integer', 'aaa') ); // { notMatched: 'integer' } 
```

## Usage ( password validator )

Check for password. Minimum 4 chars, at least one caps and one small letter, digit and special

```javascript
var v = require('2valid');
console.log( v.validate('password', 'As1eRR') ); // { notMatched: 'password' } 
console.log( v.validate('password', '!A1e') ); // null
```

Get examples

```javascript
var v = require('2valid');
var example = v.getExample('email');
console.log( example ); // news@site.com
console.log( v.validate('email', example) ); // null (email is valid)
```

## Available types

| type | description |
|------|-------------|
| string | string |
| integer | integer number |
| float | float number |
| boolean | boolean |
| array | array type |
| date | date methods |
| email | simple e-mail |
| password | password, minimum 4 chars, at least one caps and one small letter, digit and special |
| md5 | MD5 string |
| uuid | UUID string |


## Results

If validate passed, then result is ```null```.

Otherwise validate result is object with these keys:

- ```notMatched``` [object] - which key does not match which type
- ```notRequired``` [array of string] - list of keys are not in model
- ```notFound``` [array of string] - which keys in model are not found in checked object
- ```text``` [string] - simple description of all errors

For example:

```
{ notMatched: { '.id': 'integer' },
  text: 'Field .id not matched with type integer. Field .secondName not required. Field .name not found',
  notRequired: [ '.secondName' ],
  notFound: [ '.name' ] }
```


## Usage


### Simple async mode

Check if integer

```javascript
var v = require('2valid');

v.validate( 'integer', 111, function(err) {
  console.log(err); //null
});

v.validate( 'integer', '61cecfb4-da43-4b65-aaa0-f1c3be81ec53', function(err) {
  console.log(err); // { notMatched: 'integer' }
});
```

### With simple model

Check if valid to simple object with integer ```id``` and string ```name```

```javascript
var vm = require('./index');

var userModel = {
  id: {type: 'integer'},
  name: {type: 'string', required: true}
};

vm.validate( userModel,
  { id: 123, secondName: 'Max Validator' },
  function(err) {
    console.log(err); // null
  }
);
```

### Full error stack

Validation failed with all types of errors

```javascript
var vm = require('./index');

var userModel = {
  id: {type: 'integer'},
  name: {type: 'string', required: true}
};

vm.validate( userModel,
  { id: 'Max', secondName: 'Validator' },
  function(err) {
    console.log(err);
  }
);
```

Result
```
{ notMatched: { '.id': 'integer' },
  text: 'Field .id not matched with type integer. Field .secondName not required. Field .name not found',
  notRequired: [ '.secondName' ],
  notFound: [ '.name' ] }
```


### With register model

Rregister ```user``` model to check validation by model name

```javascript
var v = require('2valid');

// register model 'user' to check integer 'id' and string 'name'
v.registerModel('user', {
  id: {type: 'integer'},
  name: {type: 'string'}
});

// object to validate
var userObject = {id: 123, name: 'Alex Validates'}

// check if object is valid sync
var valid = v.validate('user', userObject);
console.log(valid.text || 'object is valid');

// check if object is valid with callback
v.validate('user', userObject, function(err) {
  console.log(err || 'object is valid');
});
```

Result

```object is valid```


### Nested object validator

Validate ```name.first``` and ```name.second```

```javascript
var v = require('2valid');

// property 'name' of 'user' model must have 'first' (required) and 'last' keys.
v.registerModel('user', {
    name: {
        first : { type: 'string', required: true },
        last  : { type: 'string' },
    }
});

// {}
console.log(v.validate('user', {name: {first: 'Alex', last: 'Validator'}}));
console.log(v.validate('user', {name: {first: 'Marry'}}));

// { notFound: [ '.id', '.name.first' ],
//   text: 'Field .id not found in registered model. Field .name.first not found in registered model' }
console.log(v.validate('user', {id: 123}));

// { notFound: [ '.name.first' ], text: 'Field .name.first not found in registered model' }
console.log(v.validate('user', {name: {last: 'Alex'}}));
```


### Regex validator

Only 'cyan', 'magenta', 'yellow' or 'key' can passed in ```cmyk``` model to validate

```javascript
var v = require('2valid');

// property 'name' of 'cmyk' model must be 'cyan', 'magenta', 'yellow' or 'key' value
v.registerModel('cmyk', {name: { type: 'string', match : /^cyan|magenta|yellow|key$/i }});

// {}
console.log(v.validate('cmyk', {name: 'Magenta'}));

// { notMatched: { '.name': 'string' }, text: 'Field .name not matched with type string' }
console.log(v.validate('cmyk', {name: 'black'}));
console.log(v.validate('cmyk', {name: 123}));
```


### Required keys validator

Check if field is required

```javascript
var v = require('2valid');

// property “id” required and must be uuid
v.registerModel('user', {id: { type: 'uuid', required: true }});

// {}
console.log(v.validate('user', {id: '61cecfb4-da43-4b65-aaa0-f1c3be81ec53'}));

// { notMatched: { '.id': 'uuid' }, text: 'Field .id not matched with type uuid' }
console.log(v.validate('user', {id: 123}));

// { notFound: [ '.name', '.id' ],
//   text: 'Field .name not found in registered model. Field .id not found in registered model' }
console.log(v.validate('user', {name: 'Alex'}));
```


### Length checking validator

Checking for fixed length of the string

```javascript
var v = require('2valid');

// property “name” must be exacly 2 chars length
v.registerModel('ISO 3166-2', {name: { type: 'string', min: 2, max: 2 }});

// {}
console.log(v.validate('ISO 3166-2', {name: 'US'}));

// { notMatched: { '.name': 'string' }, text: 'Field .name not matched with type string' }
console.log(v.validate('ISO 3166-2', {name: 123}));
console.log(v.validate('ISO 3166-2', {name: 'USA'}));
console.log(v.validate('ISO 3166-2', {name: 'U'}));
```


## Add type
You can add new type to validate in to types.js.
*'check' method is required to check new inserted type.*

For example, new type 'password'. It type must contains minimum 4 chars: at least one lower and one upper case, digit and special chars.
Add code below to types.js in list property:
```javascript
password : {
    min   : 4,         // string.min Minimum length of the string
    max   : Infinity,  // string.max Maximum length of the string
    check : function( password ){   // check password type and size
        if ( ( typeof string === 'string' || string instanceof String )
                && string.length >= this.min
                && string.length <= this.max
                && string.match(/((?=.*\\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[\W]).+)/)
        )
            return true
        else
            return false;
    }
}
```


## Tests

  npm test


## Module description
### Methods and properties of 2valid
- registerModel( modelName, modelObject ) - register model modelName with modelObject to check
- validate( modelName, entity [, callback] ) - validate model modelName with entity. Return empty object if validate is ok. As callback, return error as first argument.
- registeredModels - list of registered models
- showModelsFull() - show full information of registered model
- dispose() - remove all registered modelNames


## Register model
For register model you need to use registerModel method.

```javascript
v.registerModel( 'user', {
  id:   { type: 'uuid', required: true }, // property “id” must be uuid
  name: { type: 'string', min: 4, max: 128, required: true }, // property “name” must be String and contain 4-128
  password: { type: 'password', max: 128, required: true }, // property “password” must be String and contain 4-128 chars:
});
```


## Validate object

```javascript
v.validate( 'user', { id : '61cecfb4-da33-4b15-aa10-f1c6be81ec53', name : 'Validator', password : 'A1z!' })
```


## Exceptions

- Name is undefined
```javascript
myLibrary.registerModel( 'Name', { id: { type: 'uuid', required: true } } );
```

- Model in 'modelName' is undefined
```javascript
myLibrary.registerModel( 'modelName', NaN );
```

- Model 'modelName' is already registered
```javascript
myLibrary.registerModel( 'modelName', { id: { type: 'uuid', min: 1, max: 5, required: true } } );
myLibrary.registerModel( 'modelName', { id: { type: 'name' } } );
```

- No field 'name' in key 'name' in model 'modelName'
```javascript
myLibrary.consoleTrueOrError ( myLibrary.validate( 'modelName', { name  : 'Alex Validates' }) );
```

- No type field exception
```javascript
myLibrary.registerModel( 'name_exception', { date: { parameter: 'date' } } );
```

- No guid type exception
```javascript
myLibrary.registerModel( 'name_exception', { id: { type: 'guid' } } );
```


## Release History

* 0.1.0 Initial release
* 0.2.0 Fix nested required object error
* 0.2.2 Update errors handles
* 0.2.4 Add match ability to string
* 0.2.10 Split number to integer and float, add password type
* 0.2.12 Validate md5 hash
* 0.3.2 Change quotes in messages
* 0.4.1 Replace result with notFound, notMatched and text keys
* 2.0.1 Rename project to 2valid
* 2.2.1 Add boolean and array types
* 2.2.2 Add examples


## Created by

Dimitry, 2@ivanoff.org.ua

```curl -A cv ivanoff.org.ua```


[license-image]: http://img.shields.io/badge/license-MIT-blue.svg?style=flat
[license-url]: LICENSE

[standard-style-image]: https://img.shields.io/badge/code%20style-airbnb-blue.svg?style=flat
[standard-style-url]: https://github.com/airbnb/javascript

[npm-url]: https://npmjs.org/package/2valid
[npm-version-image]: http://img.shields.io/npm/v/2valid.svg?style=flat
[npm-downloads-image]: http://img.shields.io/npm/dm/2valid.svg?style=flat

[travis-url]: https://travis-ci.org/ivanoff/2valid
[travis-image]: https://travis-ci.org/ivanoff/2valid.svg?branch=master

[appveyor-url]: https://ci.appveyor.com/project/ivanoff/2valid/branch/master
[appveyor-image]: https://ci.appveyor.com/api/projects/status/lp3nhnam1eyyqh33/branch/master?svg=true

[coveralls-url]: https://coveralls.io/github/ivanoff/2valid
[coveralls-image]: https://coveralls.io/repos/github/ivanoff/2valid/badge.svg
