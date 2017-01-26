'use strict';

var should = require('chai').should();

describe('example', function () {

    beforeEach(function () {
        this.vm = require('../index')
    })
    afterEach(function () {
        this.vm = null
    })

    describe('get example', function () {

        it('check types list', function(done) {
            this.vm.getAllTypes().should.be.instanceof(Array);;
            this.vm.getAllTypes().should.contain('string');
            this.vm.getAllTypes().should.contain('integer');
            done();
        });

        it('check all', function(done) {
            var types = this.vm.getAllTypes();
            for(var i = 0; i < types.length; i++) {
              var example = this.vm.getExample(types[i]);
              this.vm.validate(types[i], example, function(err){
                (err === null).should.be.true;
              });
            }
            done();
        });

        it('check notype', function(done) {
            (this.vm.getExample('notype') === undefined).should.be.true;
            done();
        });

    });

});