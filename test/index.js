'use strict';

var should = require('chai').should();

describe('Validate-me tests', function () {

    beforeEach(function () {
        this.vm = require('../index')
    })
    afterEach(function () {
        this.vm = null
    })

    describe('Model to validate nested and required data', function () {

        it('register new model', function() {
            this.vm.registerModel( "user", {
                id:   { type: "uuid", required: true },
                name: { 
                    first : { type: "string", min: 1, max: 256, required: true },
                    last  : { type: "string", min: 1, max: 256 },
                },
                email: { type: "email" },
                metadata: { type: "object" },
            }).should.be.false;

            this.vm.validate( "user", {
                id    : "61cecfb4-da43-4b65-aaa0-f1c3be81ec53",
                name  : { first : "Alex", last: "Bagdanov", },
                metadata: { tt1:1, tt2:2 },
            }).should.equal(false);

            this.vm.validate( "user", {
                id    : "61cecfb4-da43-4b65-aaa0-f1c3be81ec53",
                name  : { last: "Bagdanov", },
                metadata: { tt1:1, tt2:2 },
                createdAt : new Date(),
            }).should.eql({ "": "Field 'createdAt' not found in registered model",
                ",name": "Field 'first' is requied, but not found" });
        });    


    });


    describe('Model to validate match data', function () {

        it('register model with match', function() {
            this.vm.registerModel( "user_match", {
                name: { type: "string", match : /^[A-Z]+$/ }
            }).should.be.false;

            this.vm.validate( "user_match", 
                { name  : "ILIKECAPS" }
            ).should.equal(false);

            this.vm.validate( "user_match", 
                { name  : "ILIKEcAPS" }
            ).should.eql({ "": "Field 'name' not matched with type 'string'" });
        });

    });


    describe('Model to validate integer data', function() {

        it('register model with integer', function() {
            this.vm.registerModel( "user_int", {
                id:   { type: "integer" },
            }).should.be.false;

            it('check integer data', function() {
                this.vm.validate( "user_int", 
                    { id : 123 }
                ).should.equal(false);
            });    

            it('check bad integer data', function() {
                this.vm.validate( "user_int", 
                    { id : 123.1 }
                ).should.eql({ '': 'Field "id" not matched with type "integer"' });
            });    
        });


    });


    describe('Model to validate password', function() {

        it('register model with password', function() {
            this.vm.registerModel( "user_pass", {
                pass: { type: "password" },
            }).should.be.false;

            this.vm.validate( "user_pass", 
                { pass : "R2d=" }
            ).should.equal(false);

            this.vm.validate( "user_pass", 
                { pass : "r2D2" }
            ).should.eql({ "": "Field 'pass' not matched with type 'password'" });
        });

    });


    describe('Model to validate md5', function() {

        it('register model with md5', function() {
            this.vm.registerModel( "user_pass_md5", {
                pass: { type: "md5" },
            }).should.be.false;

            this.vm.validate( "user_pass_md5", 
                { pass : "4124bc0a9335c27f086f24ba207a4912" }
            ).should.equal(false);

            this.vm.validate( "user_pass_md5", 
                { pass : "r2D2" }
            ).should.eql({ "": "Field 'pass' not matched with type 'md5'" });
        });

    });


    describe('Errors while registration', function() {
        it('register new bad model', function() {
            this.vm.registerModel( ).should.equal("Name is not defined");
        });
    });
    
});