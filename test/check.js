'use strict';

var should = require('chai').should();

describe('2valid tests', function () {

    beforeEach(function () {
        this.v = require('../index');
      });

    afterEach(function () {
        this.v = null;
      });

    describe('Simple validate', function () {

        it('name', function (done) {
            this.v.check().should.eql({});
            this.v.check('some').should.eql({});
            this.v.check('string').should.eql({ notMatched: 'string' });
            done();
          });

        it('object', function (done) {
            this.v.check({ id: { type: 'integer' } }).should.eql({});
            done();
          });

      });

  });
