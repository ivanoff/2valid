'use strict';

var should = require('chai').should();

describe('2valid show models', function () {

    beforeEach(function () {
        this.v = require('../index');
      });

    afterEach(function () {
        this.v = null;
      });

    describe('delete all models', function () {
        it('dispose', function (done) {
            this.v.dispose().should.equal(1);
            this.v.showModels().should.equal('There is no registered models');
            done();
          });
      });

    describe('show all models', function () {

        it('showModels register', function (done) {
            this.v.registerModel('userToShow', {
                id:   { type: 'uuid', required: true },
                name: {
                    first: { type: 'string', min: 1, max: 256, required: true },
                    last: { type: 'string', min: 1, max: 256 },
                  },
                email: { type: 'email' },
                metadata: { type: 'object' },
              }).should.be.false;
            done();
          });

        it('showModelsExpanded', function (done) {
            this.v.showModelsExpanded().should.match(/- userToShow/);
            this.v.showModelsExpanded().should.match(/email/);
            done();
          });

        it('showModels', function (done) {
            this.v.showModels().should.match(/- userToShow/);
            done();
          });

        it('showModels with params', function (done) {
            this.v.showModels({ displayEverything: true }).should.match(/- userToShow/);
            this.v.showModels({ displayEverything: true }).should.match(/email/);
            done();
          });
      });

  });
