'use strict';

var should = require('chai').should();

describe('2valid errors', function () {

    beforeEach(function () {
        this.vm = require('../index')
    })
    afterEach(function () {
        this.vm = null
    })

    describe('Errors while registration', function() {
        it('register new bad model', function() {
            this.vm.registerModel( ).should.equal('Name is not defined');
        });
    });

});