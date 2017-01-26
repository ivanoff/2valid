/**** List of types to validate ****/

module.exports = {

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
        example : 'Test string',
    },

    integer : { // number properties and methods
        min   : -Infinity,   // number.min Minimum number value
        max   : Infinity,    // number.max Maximum number value
        check : function( number ){ // number.check check number type and size

            return typeof number === 'number'
                    && number >= this.min
                    && number <= this.max
                    && !number.toString().match(/\./);
        },
        example : 123,
    },

    float : { // number properties and methods
        min   : -Infinity,   // number.min Minimum number value
        max   : Infinity,    // number.max Maximum number value
        check : function( number ){ // number.check check number type and size

            return typeof number === 'number'
                    && number >= this.min 
                    && number <= this.max;
        },
        example : 123.456,
    },

    boolean : {
        check : function( bool ){
            return typeof bool === 'boolean';
        },
        example : true,
    },

    date : { // date methods
        check : function( date ){  // date.check Maximum length of the string
            return date instanceof Date && typeof date.getMonth === 'function';
        },
        example : new Date(),
    },

    email : { // validate e-mail
        match : /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]+/i,
        check : function( email ){
            return email.toString().match( this.match );
        },
        example : 'news@site.com',
    },

    password : {
        min   : 4,          // minimum length of the password
        max   : 1000,       // maximum length of the password
        // at least one caps and one small letter, digit and special
        match : /^.*(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[\W]).*$/,
        check : function( password ) {   // check password type and size
            return typeof password === 'string'
                    && password.length >= this.min
                    && password.length <= this.max
                    && password.match( this.match )
        },
        example : 'JHtG<3',
    },

    md5 : {
        match : /^[\da-f]{32}$/,
        check : function( md5 ){
            return md5 && md5.toString().match( this.match );
        },
        example : 'c4ca4238a0b923820dcc509a6f75849b',
    },

    uuid : { // uuid methods. uuid.check returns true if parameter looks like UUID, false otherwise 
        match : /^[\da-z]{8}-[\da-z]{4}-4[\da-z]{3}-[\da-z]{4}-[\da-z]{12}$/,
        check : function( uuid ){
            return uuid && uuid.toString().match( this.match );
        },
        example : '4ca0025f-9618-4328-811e-f030b9c82af9',
    },

    array : {
        check : function( arr ){
            return typeof arr === 'object' && Array.isArray(arr);
        },
        example : [1, 'a', 'b'],
    },

    object : {
        check : function(){ return 1 },
        example : {},
    },

}
