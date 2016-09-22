'use strict';

var should = require('chai').should();

describe('2valid tests', function () {

    beforeEach(function () {
        this.vm = require('../index')
    })
    afterEach(function () {
        this.vm = null
    })

    describe('Simple validate', function () {

        it('validate passed', function(done) {
            this.vm.validate( 'integer', 123, function(err) {
                should.not.exist(err);
                done();
            });
        });

        it('validate failed', function(done) {
            this.vm.validate( 'integer', 'aaa', function(err) {
                err.should.eql({ notMatched: 'integer' });
                done();
            });
        });

    });

    describe('Simple model to validate', function () {

        var userModel = {
            id: {type: 'integer'},
            name: {type: 'string', required: true}
        };

        it('validate passed', function(done) {
            this.vm.validate( userModel,
                { id: 111, name: 'Max Validator' },
                function(err) {
                    should.not.exist(err);
                    done();
            });
        });

        it('validate failed', function(done) {
            this.vm.validate( userModel,
                { id: 'Max', secondName: 'Validator' },
                function(err) {
                    err.should.eql({ notMatched: { '.id': 'integer' },
                        text: 'Field .id not matched with type integer. Field .secondName not required. Field .name not found',
                        notRequired: [ '.secondName' ], notFound: [ '.name' ] });
                    done();
            });
        });

    });

    describe('Model to validate nested and required data', function () {

        it('register new model', function(done) {
            this.vm.registerModel( 'user', {
                id:   { type: 'uuid', required: true },
                name: {
                    first : { type: 'string', min: 1, max: 256, required: true },
                    last  : { type: 'string', min: 1, max: 256 },
                },
                email: { type: 'email' },
                metadata: { type: 'object' },
            }).should.be.false;
            done();
        });

        it('validate passed', function(done) {
            this.vm.validate( 'user', {
                id    : '61cecfb4-da43-4b65-aaa0-f1c3be81ec53',
                name  : { first : 'Alex', last: 'Validates', },
                metadata: { tt1:1, tt2:2 },
            }, function(err) {
                should.not.exist(err);
                done();
            });
        });

        it('validate failed', function(done) {
            this.vm.validate( 'user', {
                id    : '61cecfb4-da43-4b65-aaa0-f1c3be81ec53',
                name  : { last: 'Validates', },
                metadata: { tt1:1, tt2:2 },
                createdAt : new Date(),
            }, function(err) {
                err.should.eql({ notFound: [ '.name.first' ], notRequired: [ '.createdAt' ],
                    text: 'Field .createdAt not required. Field .name.first not found' });
                done();
            });
        });

    });

    describe('Model to validate match data', function () {

        it('register model with match data', function(done) {
            this.vm.registerModel( 'user_match', {
                name: { type: 'string', match : /^[A-Z]+$/ }
            }).should.be.false;
            done();
        });

        it('validate passed', function(done) {
            this.vm.validate( 'user_match', {
              name  : 'ILIKECAPS'
            }, function(err) {
                should.not.exist(err);
                done();
            });
        });

        it('validate failed', function(done) {
            this.vm.validate( 'user_match', {
                name  : 'ILIKEcAPS'
            }, function(err) {
                err.should.eql({ notMatched: { '.name': 'string' }, text: 'Field .name not matched with type string' });
                done();
            });
        });

    });

    describe('Model to validate integer data', function() {

        it('register model with integer', function(done) {
            this.vm.registerModel( 'user_int', {
                id:   { type: 'integer' },
            }).should.be.false;
            done();
        });

        it('validate passed', function(done) {
            this.vm.validate( 'user_int', {
                id : 123
            }, function(err) {
                should.not.exist(err);
                done();
            });
        });

        it('validate passed string', function(done) {
            this.vm.validate( 'user_int', {
                id : "123"
            }, function(err) {
                should.not.exist(err);
                done();
            });
        });

        it('check bad integer data', function(done) {
            this.vm.validate( 'user_int', {
                id : 123.1
            }, function(err) {
                err.should.eql({ notMatched: { '.id': 'integer' }, text: 'Field .id not matched with type integer' });
                done();
            });
        });

    });


    describe('Model to validate float data', function() {

        it('register model with float', function(done) {
            this.vm.registerModel( 'user_float', {
                id:   { type: 'float' },
            }).should.be.false;
            done();
        });

        it('validate passed', function(done) {
            this.vm.validate( 'user_float', {
                id : 123.321
            }, function(err) {
                should.not.exist(err);
                done();
            });
        });

        it('validate passed integer', function(done) {
            this.vm.validate( 'user_float', {
                id : 123
            }, function(err) {
                should.not.exist(err);
                done();
            });
        });

        it('validate passed string', function(done) {
            this.vm.validate( 'user_float', {
                id : "123.321"
            }, function(err) {
                should.not.exist(err);
                done();
            });
        });

    });


    describe('Model to validate password', function() {

        it('register model with integer', function(done) {
            this.vm.registerModel( 'user_pass', {
                pass: { type: 'password' },
            }).should.be.false;
            done();
        });

        it('validate passed', function(done) {
            this.vm.validate( 'user_pass', {
                pass : 'R2d='
            }, function(err) {
                should.not.exist(err);
                done();
            });
        });

        it('validate failed', function(done) {
            this.vm.validate( 'user_pass', {
                pass : 'r2D2'
            }, function(err) {
                err.should.eql({ notMatched: { '.pass': 'password' }, text: 'Field .pass not matched with type password' });
                done();
            });
        });

    });


    describe('Model to validate md5', function() {

        it('register model with integer', function(done) {
            this.vm.registerModel( 'user_pass_md5', {
                pass: { type: 'md5' },
            }).should.be.false;
            done();
        });

        it('validate passed', function(done) {
            this.vm.validate( 'user_pass_md5', {
                pass : '4124bc0a9335c27f086f24ba207a4912'
            }, function(err) {
                should.not.exist(err);
                done();
            });
        });

        it('string validate failed', function(done) {
            this.vm.validate( 'user_pass_md5', {
                pass : 'r2D2'
            }, function(err) {
                err.should.eql({ notMatched: { '.pass': 'md5' }, text: 'Field .pass not matched with type md5' });
                done();
            });
        });

        it('integer validate failed', function(done) {
            this.vm.validate( 'user_pass_md5', {
                pass : 123
            }, function(err) {
                err.should.eql({ notMatched: { '.pass': 'md5' }, text: 'Field .pass not matched with type md5' });
                done();
            });
        });

    });

});