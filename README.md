2valid
=========

JavaScript simple data validator

v2.0.2


## Installation
```npm install --save 2valid```


## Usage

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


## Validate result

If validate passed, then empty object returned.
- Example: {}

If validate not passed, then validate result contains ```text``` field with error description.
Also, there can be ```notFound``` and ```notMatched``` keys to find what keys was not found or not matched.
- Example: { notFound: [ '.name.first' ], text: 'Field .name.first not found in registered model' }
- Example: { notMatched: { '.id': 'uuid' }, text: 'Field .id not matched with type uuid' }


## Nested object validator

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


## Regex validator

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


## Required keys validator

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


## Length checking validator

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


## Created by

Dimitry, 2@ivanoff.org.ua

curl -A cv ivanoff.org.ua

