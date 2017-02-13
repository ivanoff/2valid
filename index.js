/*!
 * validate-me
 * Copyright(c) 2015-2017 ivanoff .$ curl -A cv ivanoff.org.ua
 * MIT Licensed
 */

'use strict';

// All avaible type defenitions are in types.js
exports.types = require('./types');

exports.errors = [];
exports.registeredModels = [];

// Check new model before registration
function deepLook(obj, types) {
  for (var key in obj) {
    if (!obj[key].type) {
      obj[key] = deepLook(obj[key], types);
    } else {
      if (!types[obj[key].type]) {
        throw new Error('No type ' + obj[key].type + ' in Types: key ' + key);
      }

      // check for range in new object
      if (typeof obj[key].min !== 'undefined'
        && typeof types[obj[key].type].min !== 'undefined'
        && types[obj[key].type].min > obj[key].min) {
        throw new Error('Key ' + key + ' minimal value (' + obj[key].min
          + ') is less than acceptable minimal in Types ('
          + types[obj[key].type].min + ')');
      }

      if (typeof obj[key].max !== 'undefined'
        && typeof types[obj[key].type].max !== 'undefined'
        && types[obj[key].type].max < obj[key].max) {
        throw new Error('Key ' + key + ' maximal value (' + obj[key].max
          + ') is in excess of maximal acceptable value in Types ('
          + types[obj[key].type].max + ')');
      }
    }

    // get properties and methods from Types
    for (var keyParent in types[obj[key].type]) {
      if (!obj[key][keyParent]) {
        obj[key][keyParent] = types[obj[key].type][keyParent];
      }
    }
  }

  return obj;
};

// Register new model. Return validate-me object
// Parameters: modelName - name of the model, modelObject - model object
exports.registerModel = function (modelName, modelObject) {

  // check for name, object and if model already exists
  if (!modelName) return ('Name is not defined');
  if (!modelObject) return ('Model in ' + modelName + ' is not defined');
  if (this.registeredModels[modelName])
    return ('Model ' + modelName + ' is already registered');
  var o = Object.create(modelObject);
  this.registeredModels[modelName] = deepLook(o, this.types);
  return false;
};

// Show information of registered models. All registered models are stored in .registeredModels
// If params.displayEverything is true, module will show additional info
exports.showModels = function (params) {
  var res = [];
  if (typeof (params) === 'undefined') params = { displayEverything: false };
  if (!this.registeredModels || Object.keys(this.registeredModels).length === 0) {
    res.push('There is no registered models');
  } else {
    res.push('List of registered models');
    for (var modelName in this.registeredModels) {
      res.push('  - ' + modelName);
      if (params.displayEverything) {
        for (var key in this.registeredModels[modelName]) {
          res.push('      ' + key + ' : ' + this.registeredModels[modelName][key].type);
        }
      }
    }
  }

  return res.join('\n');
};

// Show expanded information of registared models
exports.showModelsExpanded = function () {
  return this.showModels({ displayEverything: true });
};

// check for required fields recursively
function validateObjectRequired(options, modelObject, entity, parents, errors) {
  if (!options) options = {};
  for (var key in modelObject) {
    if (!modelObject[key].type) {
      validateObjectRequired(
        options,
        modelObject[key],
        entity[key],
        parents + '.' + key,
        errors);
    } else if (!options.notRequired && modelObject[key].required && (!entity || !entity[key])) {
      if (!errors.notFound) errors.notFound = [];
      var fieldName = parents + '.' + key;
      errors.notFound.push(fieldName);
      errors.text.push('Field ' + fieldName + ' not found');
    }
  }

  return errors;
};

// check for extra fields and match recursively
function validateObjectEntity(modelObject, entity, parents, errors) {
  if (!errors) errors = {};
  if (!errors.text) errors.text = [];
  if (!parents) parents = [];

  for (var key in entity) {
    var fieldName = parents + '.' + key;
    if (!modelObject[key]) {
      if (!errors.notRequired) errors.notRequired = [];
      errors.notRequired.push(fieldName);
      errors.text.push('Field ' + fieldName + ' not required');
    } else if (!modelObject[key].type) {
      validateObjectEntity(modelObject[key], entity[key], [parents, key], errors);
    } else if (!modelObject[key].check(entity[key])) {
      if (!errors.notMatched) errors.notMatched = {};
      errors.notMatched[fieldName] = modelObject[key].type;
      errors.text.push('Field ' + fieldName + ' not matched with type ' + modelObject[key].type);
    }
  }

  return errors;
};

// Check if entity pass modelName's validation
exports.validate = function (modelName, entity, options, next) {
  if (typeof options === 'function') {
    next = options;
    options = {};
  }

  var modelObject = this.registeredModels[modelName];

  if (typeof modelName === 'object') {
    modelObject = deepLook(modelName, this.types);
  } else if (this.types[modelName]) {
    var result = this.types[modelName].check(entity) ? null : { notMatched: modelName };
    return typeof next === 'function' ? next(result) : result;
  }

  var errors = validateObjectRequired(
    options, modelObject, entity, [],
    validateObjectEntity(modelObject, entity)
  );
  if (!errors.text[0]) errors = {};
  if (errors && errors.text) errors.text = errors.text.join('. ');

  if (typeof next === 'function') {
    next(Object.keys(errors).length ? errors : null);
  } else {
    return Object.keys(errors).length ? errors : {};
  }
};

exports.getAllTypes = function () {
  return Object.keys(this.types);
};

exports.getExample = function (type) {
  return this.types[type] ? this.types[type].example : undefined;
};

// 'Forget' about all registered models
exports.dispose = function () {
  this.registeredModels = [];
  return 1;
};

