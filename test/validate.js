'use strict';

var should = require('chai').should();

describe('2valid tests', function () {

    beforeEach(function () {
        this.vm = require('../index');
      });

    afterEach(function () {
        this.vm = null;
      });

    describe('Simple validate', function () {

        it('name', function (done) {
            this.vm.validate().should.eql({});
            this.vm.validate('some').should.eql({});
            this.vm.validate('string').should.eql({ notMatched: 'string' });
            done();
          });

        it('object', function (done) {
            this.vm.validate({ id: { type: 'integer' } }).should.eql({});
            done();
          });

      });

  });
