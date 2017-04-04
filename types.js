/**** List of types to validate ****/

module.exports = {

    string: { // string properties and methods
        min: 0,        // string.min Minimum length of the string
        max: Infinity, // string.max Maximum length of the string
        check: function (string) { // string.check check sting type and size

            return ((typeof string === 'string' || string instanceof String)
                    && string.length >= this.min
                    && string.length <= this.max
                    && (!this.match || string.match(this.match))
                   );
          },

        examples: ['Test string', 'foo', 'bar'],
      },

    integer: { // number properties and methods
        min: -Infinity,   // number.min Minimum number value
        max: Infinity,    // number.max Maximum number value
        check: function (number) { // number.check check number type and size

            return typeof number === 'number'
                    && number >= this.min
                    && number <= this.max
                    && !number.toString().match(/\./);
          },

        examples: [123, 345, 12345, 4321],
      },

    float: { // number properties and methods
        min: -Infinity,   // number.min Minimum number value
        max: Infinity,    // number.max Maximum number value
        check: function (number) { // number.check check number type and size

            return typeof number === 'number'
                    && number >= this.min
                    && number <= this.max;
          },

        examples: [123.456, 12.12, 129.2],
      },

    boolean: {
        check: function (bool) {
            return typeof bool === 'boolean';
          },

        examples: [true, false],
      },

    date: { // date methods
        check: function (date) {  // date.check Maximum length of the string
            return date instanceof Date && typeof date.getMonth === 'function';
          },

        examples: [new Date(), new Date(99, 5, 24), new Date(86400000)],
      },

    email: { // validate e-mail
        match: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]+/i,
        check: function (email) {
            return email.toString().match(this.match);
          },

        examples: ['news@site.com', 'demo@site.net', 'noreply@site.demo'],
      },

    password: {
        min: 4,          // minimum length of the password
        max: 1000,       // maximum length of the password
        // at least one caps and one small letter, digit and special
        match: /^.*(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[\W]).*$/,
        check: function (password) {   // check password type and size
            return typeof password === 'string'
                    && password.length >= this.min
                    && password.length <= this.max
                    && password.match(this.match);
          },

        examples: ['JHtG<3', 'r2d2Ro60!', 'vAr$$t0p!'],
      },

    md5: {
        match: /^[\da-f]{32}$/,
        check: function (md5) {
            return md5 && md5.toString().match(this.match);
          },

        examples: ['c4ca4238a0b923820dcc509a6f75849b', '1bc29b36f623ba82aaf6724fd3b16718'],
      },

    uuid: { // uuid methods. uuid.check returns true if parameter looks like UUID, false otherwise
        match: /^[\da-z]{8}-[\da-z]{4}-4[\da-z]{3}-[\da-z]{4}-[\da-z]{12}$/,
        check: function (uuid) {
            return uuid && uuid.toString().match(this.match);
          },

        examples: ['4ca0025f-9618-4328-811e-f030b9c82af9', 'eacb7ac5-4fca-4394-ba5c-63437c63b095'],
      },

    array: {
        check: function (arr) {
            return typeof arr === 'object' && Array.isArray(arr);
          },

        examples: [[1, 'a', 'b'], ['a', 'b'], [1, 2, 3]],
      },

    any: {
        check: function (element) {
            var hasOne = typeof this.one === 'object' && Array.isArray(this.one) && this.one[0];
            return hasOne && this.one.indexOf(element) >= 0;
          },

        examples: ['Male', 'Female'],
      },

    object: {
        check: function () { return 1; },

        examples: [{}],
      },

  };
