/*!
 * 2valid
 * Copyright(c) 2015-2017 ivanoff .$ curl -A cv ivanoff.org.ua
 * MIT Licensed
 */

'use strict';
var types = require('./types');

// Check new model before registration
function deepLook(obj, types) {
  if (typeof (obj) !== 'object') return obj;
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

// check for required fields recursively
function validateObjectRequired(options, modelObject, entity, parents, errors) {
  for (var key in modelObject) {
    if (!modelObject[key].type && entity) {
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
    if (!modelObject || !modelObject[key]) {
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

exports = module.exports = {

  // All avaible type defenitions are in types.js
  types: types,

  errors: [],
  registeredModels: [],

  // Register new model. Return 2valid object
  // Parameters: modelName - name of the model, modelObject - model object
  registerModel: function (modelName, modelObject) {

    // check for name, object and if model already exists
    if (!modelName) return ('Name is not defined');
    if (!modelObject) return ('Model in ' + modelName + ' is not defined');
    if (this.registeredModels[modelName])
      return ('Model ' + modelName + ' is already registered');
    var o = Object.create(modelObject);
    this.registeredModels[modelName] = deepLook(o, this.types);
    return false;
  },

  // Show information of registered models. All registered models are stored in .registeredModels
  // If params.displayEverything is true, module will show additional info
  showModels: function (params) {
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
  },

  // Show expanded information of registared models
  showModelsExpanded: function () {
    return this.showModels({ displayEverything: true });
  },

  /**
   * @deprecated Since version 3.0. Will be deleted in version 4.0. Use check instead.
   */
  validate: function (modelName, entity, options, next) {
    console.warn('Calling deprecated function! Use check instead of validate');
    return this.check(modelName, entity, options, next);
  },

  // Check if entity pass modelName's validation
  check: function (modelName, entity, options, next) {
    if (typeof options === 'function') next = options;
    if (!options) options = {};

    var modelObject = this.registeredModels[modelName];

    if (typeof modelName === 'object') {
      modelObject = deepLook(modelName, this.types);
    } else if (this.types[modelName]) {
      if (options.one) this.types[modelName].one = options.one;
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
  },

  valid: function (modelName, entity, options) {
    var result = this.check(modelName, entity, options);
    return Object.keys(result) == 0 || !result;
  },

  getAllTypes: function () {
    return Object.keys(this.types);
  },

  // Get one example for type
  getExample: function (type) {
    var examples = this.getExamples(type);
    return examples[0];
  },

  // Get one random example for type
  getRandomExample: function (type) {
    var examples = this.getExamples(type);
    return examples[Math.floor(Math.random() * examples.length)];
  },

  // Get all examples for type
  // Result: Array
  getExamples: function (type) {
    return this.types[type] ? this.types[type].examples : [];
  },

  // 'Forget' about all registered models
  dispose: function () {
    this.registeredModels = [];
    return 1;
  },

};
