/*!
 * validate-me
 * Copyright(c) 2015 ivanoff .$ curl -A cv ivanoff.org.ua
 * MIT Licensed
 */

'use strict';

// All avaible type defenitions are in types.js
exports.types = require( './types' );

exports.errors = [];
exports.registeredModels = [];

// Check new model before registration
function deepLook ( obj, types ){
    for( var key in obj ){
        if ( !obj[key].type ) {
            obj[key] = deepLook( obj[key], types );
        } else {
            if ( ! types[ obj[key].type ] ) {
                throw new Error("No type '"+ obj[key].type +"' in Types: key '"+ key +"'");
            }
            // check for range in new object
            if ( typeof obj[key].min !== 'undefined' 
                    && typeof types[ obj[key].type ].min !== 'undefined' 
                    && types[ obj[key].type ].min > obj[key].min ) {
                throw new Error("In model '"+ modelName +"', key '"+ key +"' minimal value ( "+ obj[key].min +" ) is less than acceptable minimal in Types"
                                + " ( " + types[ obj[key].type ].min + " )" );
            }
            if ( typeof obj[key].max !== 'undefined' 
                    && typeof types[ obj[key].type ].max !== 'undefined' 
                    && types[ obj[key].type ].max < obj[key].max ) {
                throw new Error("In model '"+ modelName +"', key '"+ key +"' maximal value ( "+ obj[key].max +" ) is in excess of maximal acceptable value in Types"
                                + " ( " + types[ obj[key].type ].min + " )" );
            }
        }
        // get properties and methods from Types
        for( var key_parent in types[ obj[key].type ] ){
            if ( !obj[ key ][ key_parent ] ) {
                obj[ key ][ key_parent ] = types[ obj[key].type ][ key_parent ];
            }
        }
    }
    return obj;
}

// Register new model. Return validate-me object
// Parameters: modelName - name of the model, modelObject - model object
exports.registerModel = function ( modelName, modelObject ) {
    // check for name, object and if model already exists
    if ( ! modelName )   return( "Name is not defined" );
    if ( ! modelObject ) return( "Model in '"+ modelName +"' is not defined" );
    if ( this.registeredModels[ modelName ] )
                         return( "Model '"+ modelName +"' is already registered" );
    var o = Object.create( modelObject );
    this.registeredModels[ modelName ] = deepLook( o, this.types );
    return false;
}

// Show information of registered models. All registered models are stored in .registeredModels
// If params.displayEverything is true, module will show additional info
exports.showModels = function( params ) {
    if ( typeof( params ) === 'undefined' ) params = { displayEverything: false };
    if ( ! this.registeredModels ) {
        console.log( "There is no registered models" );
    } else {
        console.log( "List of registered models" );
        for( var modelName in this.registeredModels ){
            console.log( "  - " + modelName );
            if( params.displayEverything ) {
                for( var key in this.registeredModels[ modelName ] ){
                    console.log( "      " + key + " : " + this.registeredModels[ modelName ][ key ].type );
                }
            }
        }
    }
}

// Show expanded information of registared models
exports.showModelsExpanded = function() {
    this.showModels( { displayEverything: true } );
}

// check for required fields recursively
function validateObjectRequired ( modelObject, entity, parents, errors ) {
    if( !errors ) errors = {};
    for( var key in modelObject ){
        if ( !modelObject[ key ].type ) {
            validateObjectRequired ( 
                    modelObject[ key ], 
                    entity? entity[ key ] : {}, 
                    parents? [ parents, key ] : key,
                    errors )
        } 
        else if( modelObject[ key ].required && ( !entity || !entity[ key ] ) ) {
            errors[parents] = "Field '"+ key +"' is requied, but not found";
        }
    }
    return errors;
}
// check for extra fields and match recursively
function validateObjectEntity ( modelObject, entity, parents, errors ) {
    if( !errors ) errors = {};
    for( var key in entity ){
        if ( !modelObject[ key ] ) {
            errors[parents] = "Field '"+ key +"' not found in registered model";
        }
        else if ( !modelObject[ key ].type ) {
            validateObjectEntity ( modelObject[ key ], entity[ key ], parents? [ parents, key ] : key, errors )
        } 
        else if( !modelObject[ key ].check( entity[ key ] ) ) {
            errors[parents] = "Field '"+ key +"' not matched with type '"+ modelObject[ key ].type +"'";
        }
    }
    return errors;
}

// Check if entity pass modelName's validation
exports.validate = function( modelName, entity ) {
    var modelObject = this.registeredModels[ modelName ];
    var errors = validateObjectRequired ( 
                    modelObject, entity, [],
                    validateObjectEntity ( modelObject, entity, [] ) 
                 );
    if( !Object.keys(errors).length ) errors = false;
    return errors;
}

// "Forget" about all registered models
exports.dispose = function() {
    this.registeredModels = [];
    return 1;
}

