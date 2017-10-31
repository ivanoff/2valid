'use strict';

var should = require('chai').should();

describe('Sync 2valid check tests', function () {

    beforeEach(function () {
        this.v = require('../index');
      });

    afterEach(function () {
        this.v = null;
      });

    describe('Model to validate nested and required data', function () {

        it('register new model', function () {
            this.v.registerModel('user_sync', {
                id:   { type: 'uuid', required: true },
                name: {
                    first: { type: 'string', min: 1, max: 256, required: true },
                    last: { type: 'string', min: 1, max: 256 },
                  },
                email: { type: 'email' },
                birthday: { type: 'date' },
                alive: { type: 'boolean' },
                childrens: { type: 'array' },
                metadata: { type: 'object' },
              }).should.be.false;

            this.v.check('user_sync', {
                id: '61cecfb4-da43-4b65-aaa0-f1c3be81ec53',
                name: { first: 'Alex', last: 'Validates', },
                metadata: { tt1: 1, tt2: 2 },
              }).should.eql({});

            this.v.check('user_sync', {
                id: '61cecfb4-da43-4b65-aaa0-f1c3be81ec53',
                name: { last: 'Validates', },
                metadata: { tt1: 1, tt2: 2 },
                email: 'max.validator@my.site',
                birthday: new Date('1980-04-01'),
                childrens: ['Maria', 'Alexandra'],
                alive: true,
                createdAt: new Date(),
              }).should.eql({ notFound: ['.name.first'], notRequired: ['.createdAt'],
              text: 'Field .createdAt not required. Field .name.first not found', });
          });

      });

    describe('Model to validate notRequired data', function () {

        it('register new model', function () {
            this.v.check('user_sync', {
                id: '61cecfb4-da43-4b65-aaa0-f1c3be81ec53',
                name: { first: 'Alex', last: 'Validates', },
                metadata: { tt1: 1, tt2: 2 },
              }, { notRequired: 1 }).should.eql({});

            this.v.check('user_sync', {
                id: '61cecfb4-da43-4b65-aaa0-f1c3be81ec53',
                name: { last: 'Validates', },
                metadata: { tt1: 1, tt2: 2 },
              }, { notRequired: 1 }).should.eql({});
          });

      });

    describe('Model to validate match data', function () {

        it('register model with match', function () {
            this.v.registerModel('user_match_sync', {
                name: { type: 'string', match: /^[A-Z]+$/ },
              }).should.be.false;

            this.v.check('user_match_sync',
                { name: 'ILIKECAPS' }
            ).should.eql({});

            this.v.check('user_match_sync',
                { name: 'ILIKEcAPS' }
            ).should.eql({ notMatched: { '.name': 'string' },
              text: 'Field .name not matched with type string', });
          });

      });

    describe('Model to validate integer data', function () {

        it('register model with integer', function () {
            this.v.registerModel('user_int_sync', {
                id:   { type: 'integer' },
              }).should.be.false;

            it('check integer data', function () {
                this.v.check('user_int_sync',
                    { id: 123 }
               ).should.eql({});
              });

            it('check bad integer data', function () {
                this.v.check('user_int_sync',
                    { id: 123.1 }
               ).should.eql({ notMatched: { '.name': 'string' },
                  text: 'Field .name not matched with type string', });
              });
          });

      });

    describe('Model to validate integer data', function () {

        it('register model with boolean', function () {
            this.v.registerModel('user_bool_sync', {
                isAlive:   { type: 'integer' },
              }).should.be.false;

            it('check boolean data', function () {
                this.v.check('user_bool_sync',
                    { isAlive: true }
               ).should.eql({});
              });

            it('check boolean data', function () {
                this.v.check('user_bool_sync',
                    { isAlive: false }
               ).should.eql({});
              });

            it('check bad boolean data', function () {
                this.v.check('user_bool_sync',
                    { isAlive: 123 }
               ).should.eql({ notMatched: { '.isAlive': 'boolean' },
                  text: 'Field .isAlive not matched with type boolean', });
              });
          });

      });

    describe('Model to validate password', function () {

        it('register model with password', function () {
            this.v.registerModel('user_pass_sync', {
                pass: { type: 'password' },
              }).should.be.false;

            this.v.check('user_pass_sync',
                { pass: 'R2d=' }
            ).should.eql({});

            this.v.check('user_pass_sync',
                { pass: 'r2D2' }
            ).should.eql({ notMatched: { '.pass': 'password' },
              text: 'Field .pass not matched with type password', });
          });

      });

    describe('Model to validate md5', function () {

        it('register model with md5', function () {
            this.v.registerModel('user_pass_md5_sync', {
                pass: { type: 'md5' },
              }).should.be.false;

            this.v.check('user_pass_md5_sync',
                { pass: '4124bc0a9335c27f086f24ba207a4912' }
            ).should.eql({});

            this.v.check('user_pass_md5_sync',
                { pass: 'r2D2' }
            ).should.eql({ notMatched: { '.pass': 'md5' },
              text: 'Field .pass not matched with type md5', });

            this.v.check('user_pass_md5_sync',
                { pass: 123 }
            ).should.eql({ notMatched: { '.pass': 'md5' },
              text: 'Field .pass not matched with type md5', });
          });

      });

  });

describe('Sync 2valid valid tests', function () {

    beforeEach(function () {
        this.v = require('../index');
      });

    afterEach(function () {
        this.v = null;
      });

    describe('Model to validate nested and required data', function () {

        it('register new model', function () {
            this.v.registerModel('user_valid_sync', {
                id:   { type: 'uuid', required: true },
                name: {
                    first: { type: 'string', min: 1, max: 256, required: true },
                    last: { type: 'string', min: 1, max: 256 },
                  },
                email: { type: 'email' },
                birthday: { type: 'date' },
                alive: { type: 'boolean' },
                childrens: { type: 'array' },
                metadata: { type: 'object' },
              }).should.be.false;

            this.v.valid('user_valid_sync', {
                id: '61cecfb4-da43-4b65-aaa0-f1c3be81ec53',
                name: { first: 'Alex', last: 'Validates', },
                metadata: { tt1: 1, tt2: 2 },
              }).should.be.true;

            this.v.valid('user_valid_sync', {
                id: '61cecfb4-da43-4b65-aaa0-f1c3be81ec53',
                name: { last: 'Validates', },
                metadata: { tt1: 1, tt2: 2 },
                email: 'max.validator@my.site',
                birthday: new Date('1980-04-01'),
                childrens: ['Maria', 'Alexandra'],
                alive: true,
                createdAt: new Date(),
              }).should.be.false;
          });

      });

    describe('Model to validate notRequired data', function () {

        it('register new model', function () {
            this.v.valid('user_valid_sync', {
                id: '61cecfb4-da43-4b65-aaa0-f1c3be81ec53',
                name: { first: 'Alex', last: 'Validates', },
                metadata: { tt1: 1, tt2: 2 },
              }, { notRequired: 1 }).should.be.true;

            this.v.valid('user_valid_sync', {
                id: '61cecfb4-da43-4b65-aaa0-f1c3be81ec53',
                name: { last: 'Validates', },
                metadata: { tt1: 1, tt2: 2 },
              }, { notRequired: 1 }).should.be.true;
          });

      });

    describe('Model to validate match data', function () {

        it('register model with match', function () {
            this.v.registerModel('user_valid_match_sync', {
                name: { type: 'string', match: /^[A-Z]+$/ },
              }).should.be.false;

            this.v.valid('user_valid_match_sync',
                { name: 'ILIKECAPS' }
            ).should.be.true;

            this.v.valid('user_valid_match_sync',
                { name: 'ILIKEcAPS' }
            ).should.be.false;
          });

      });

    describe('Model to validate integer data', function () {

        it('register model with integer', function () {
            this.v.registerModel('user_valid_int_sync', {
                id:   { type: 'integer' },
              }).should.be.false;

            it('check integer data', function () {
                this.v.valid('user_valid_int_sync',
                    { id: 123 }
               ).should.be.true;
              });

            it('check bad integer data', function () {
                this.v.valid('user_valid_int_sync',
                    { id: 123.1 }
               ).should.be.false;
              });
          });

      });

    describe('Model to validate integer data', function () {

        it('register model with boolean', function () {
            this.v.registerModel('user_valid_bool_sync', {
                isAlive:   { type: 'integer' },
              }).should.be.false;

            it('check boolean data', function () {
                this.v.valid('user_valid_bool_sync',
                    { isAlive: true }
               ).should.be.true;
              });

            it('check boolean data', function () {
                this.v.valid('user_valid_bool_sync',
                    { isAlive: false }
               ).should.be.true;
              });

            it('check bad boolean data', function () {
                this.v.valid('user_valid_bool_sync',
                    { isAlive: 123 }
               ).should.be.false;
              });
          });

      });

    describe('Model to validate password', function () {

        it('register model with password', function () {
            this.v.registerModel('user_valid_pass_sync', {
                pass: { type: 'password' },
              }).should.be.false;

            this.v.valid('user_valid_pass_sync',
                { pass: 'R2d=' }
            ).should.be.true;

            this.v.valid('user_valid_pass_sync',
                { pass: 'r2D2' }
            ).should.be.false;
          });

      });

    describe('Model to validate md5', function () {

        it('register model with md5', function () {
            this.v.registerModel('user_valid_pass_md5_sync', {
                pass: { type: 'md5' },
              }).should.be.false;

            this.v.valid('user_valid_pass_md5_sync',
                { pass: '4124bc0a9335c27f086f24ba207a4912' }
            ).should.be.true;

            this.v.valid('user_valid_pass_md5_sync',
                { pass: 'r2D2' }
            ).should.be.false;

            this.v.valid('user_valid_pass_md5_sync',
                { pass: 123 }
            ).should.be.false;
          });

      });

  });

