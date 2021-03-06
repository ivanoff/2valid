'use strict';

/**
 * @deprecated Since version 3.0. Will be deleted in version 4.0. Use check instead.
 */

var should = require('chai').should();

describe('2valid tests', function () {

    beforeEach(function () {
        this.v = require('../index');
      });

    afterEach(function () {
        this.v = null;
      });

    describe('Simple validate', function () {

        console.warn("Calling deprecated function! Use check instead of validate");

        it('name', function (done) {
            this.v.validate().should.eql({});
            this.v.validate('some').should.eql({});
            this.v.validate('string').should.eql({ notMatched: 'string' });
            done();
          });

        it('object', function (done) {
            this.v.validate({ id: { type: 'integer' } }).should.eql({});
            done();
          });

      });

  });
