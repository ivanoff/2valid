'use strict';

var should = require('chai').should();

describe('example', function () {

    beforeEach(function () {
        this.v = require('../index');
      });

    afterEach(function () {
        this.v = null;
      });

    describe('get example', function () {

        it('check types list', function (done) {
            this.v.getAllTypes().should.be.instanceof(Array);
            this.v.getAllTypes().should.contain('string');
            this.v.getAllTypes().should.contain('integer');
            done();
          });

        it('check getExamples', function (done) {
            var types = this.v.getAllTypes();
            for (var i = 0; i < types.length; i++) {
              var example = this.v.getExamples(types[i]);
              example.should.be.instanceof(Array);
              var opt = (types[i] !== 'any')? {} : {one:['Male','Female']};
              this.v.check(types[i], example[0], opt, function (err) {
                (err === null).should.be.true;
              });
            }

            done();
          });

        it('check all', function (done) {
            var types = this.v.getAllTypes();
            for (var i = 0; i < types.length; i++) {
              var example = this.v.getExample(types[i]);
              var opt = (types[i] !== 'any')? {} : {one:['Male','Female']};
              this.v.check(types[i], example, opt, function (err) {
                (err === null).should.be.true;
              });
            }

            done();
          });

        it('check all', function (done) {
            var types = this.v.getAllTypes();
            for (var i = 0; i < types.length; i++) {
              var example = this.v.getRandomExample(types[i]);
              var opt = (types[i] !== 'any')? {} : {one:['Male','Female']};
              this.v.check(types[i], example, opt, function (err) {
                (err === null).should.be.true;
              });
            }

            done();
          });

        it('check notype', function (done) {
            (this.v.getExample('notype') === undefined).should.be.true;
            done();
          });

        it('check notype', function (done) {
            (this.v.getRandomExample('notype') === undefined).should.be.true;
            done();
          });

      });

  });
