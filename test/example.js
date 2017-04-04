'use strict';

var should = require('chai').should();

describe('example', function () {

    beforeEach(function () {
        this.vm = require('../index');
      });

    afterEach(function () {
        this.vm = null;
      });

    describe('get example', function () {

        it('check types list', function (done) {
            this.vm.getAllTypes().should.be.instanceof(Array);
            this.vm.getAllTypes().should.contain('string');
            this.vm.getAllTypes().should.contain('integer');
            done();
          });

        it('check getExamples', function (done) {
            var types = this.vm.getAllTypes();
            for (var i = 0; i < types.length; i++) {
              var example = this.vm.getExamples(types[i]);
              example.should.be.instanceof(Array);
              var opt = (types[i] !== 'any')? {} : {one:['Male','Female']};
              this.vm.validate(types[i], example[0], opt, function (err) {
                (err === null).should.be.true;
              });
            }

            done();
          });

        it('check all', function (done) {
            var types = this.vm.getAllTypes();
            for (var i = 0; i < types.length; i++) {
              var example = this.vm.getExample(types[i]);
              var opt = (types[i] !== 'any')? {} : {one:['Male','Female']};
              this.vm.validate(types[i], example, opt, function (err) {
                (err === null).should.be.true;
              });
            }

            done();
          });

        it('check all', function (done) {
            var types = this.vm.getAllTypes();
            for (var i = 0; i < types.length; i++) {
              var example = this.vm.getRandomExample(types[i]);
              var opt = (types[i] !== 'any')? {} : {one:['Male','Female']};
              this.vm.validate(types[i], example, opt, function (err) {
                (err === null).should.be.true;
              });
            }

            done();
          });

        it('check notype', function (done) {
            (this.vm.getExample('notype') === undefined).should.be.true;
            done();
          });

        it('check notype', function (done) {
            (this.vm.getRandomExample('notype') === undefined).should.be.true;
            done();
          });

      });

  });
