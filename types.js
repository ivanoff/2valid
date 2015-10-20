/**** List of types to validate ****/

module.exports = {

    uuid : { // uuid methods. uuid.check returns true if parameter looks like UUID, false otherwise 
        match : /^[\da-z]{8}-[\da-z]{4}-4[\da-z]{3}-[\da-z]{4}-[\da-z]{12}$/,
        check : function( uuid ){
            return uuid && uuid.match( this.match );
        },
    },

    string : { // string properties and methods
        min   : 0,        // string.min Minimum length of the string
        max   : Infinity, // string.max Maximum length of the string
        check : function( string ){ // string.check check sting type and size
            
            return (( typeof string === 'string' || string instanceof String )
                    && string.length >= this.min 
                    && string.length <= this.max
                    && ( !this.match || string.match( this.match ) )
                   );
        },
    },

    integer : { // number properties and methods
        min   : -Infinity,   // number.min Minimum number value
        max   : Infinity,    // number.max Maximum number value
        check : function( number ){ // number.check check number type and size
            return typeof number === 'number' 
                    && number >= this.min 
                    && number <= this.max
                    && !((""+number).match(/\./));
        },
    },

    float : { // number properties and methods
        min   : -Infinity,   // number.min Minimum number value
        max   : Infinity,    // number.max Maximum number value
        check : function( number ){ // number.check check number type and size
            return typeof number === 'number' 
                    && number >= this.min 
                    && number <= this.max;
        },
    },

    date : { // date methods
        check : function( date ){  // date.check Maximum length of the string
            return date instanceof Date && typeof date.getMonth === 'function';
        },
    },

    email : { // date methods
        match : /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]+/i,
        check : function( email ){  // date.check Maximum length of the string
            return email.match( this.match );
        },
    },

    password : {
        min   : 4,          // minimum length of the password
        max   : Infinity,
        // at least one caps and one small letter, digit and special
        match : /^.*(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[\W]).*$/,
        check : function( password ) {   // check password type and size
            return typeof password === 'string'
                    && password.length >= this.min 
                    && password.length <= this.max 
                    && password.match( this.match ) 
        },
    },

    md5 : { 
        match : /^[\da-f]{32}$/,
        check : function( md5 ){
            return md5 && md5.match( this.match );
        },
    },

    object : { 
        check : function(){ return 1 }
    },

}


