var should = require('chai').should(),
    vm = require('../index'),
    errors = vm.errors,
    show = vm.showModels,
    showExpanded = vm.showModelsExpanded,
    validate = vm.validate,
    dispose = vm.dispose,
    showErrors = vm.showErrors;

describe('#register', function() {

  it('register new model', function() {
    vm.registerModel( "user", {
        id:   { type: "uuid", required: true },
        name: { 
            first : { type: "string", min: 1, max: 256, required: true },
            last  : { type: "string", min: 1, max: 256 },
        },
        email: { type: "email" },
        metadata: { type: "object" },
    }).should.be.false;
  });


  it('check good data', function() {
    vm.validate( "user", {
      id    : "61cecfb4-da43-4b65-aaa0-f1c3be81ec53",
      name  : { first : "Alex", last: "Bagdanov", },
      metadata: { tt1:1, tt2:2 },
    }).should.equal(false);
  });    


  it('register model with match', function() {
    vm.registerModel( "user_match", {
        name: { type: "string", match : /^[A-Z]+$/ }
    }).should.be.false;
  });


  it('check match data', function() {
    vm.validate( "user_match", 
        { name  : "ILIKECAPS" }
    ).should.equal(false);
  });    


  it('check bad match data', function() {
    vm.validate( "user_match", 
        { name  : "ILIKEcAPS" }
    ).should.eql({ '': 'Field "name" not matched with type "string"' });
  });    


  it('register model with integer and password', function() {
    vm.registerModel( "user_int", {
        id:   { type: "integer" },
        pass: { type: "password" },
    }).should.be.false;
  });


  it('check int and password data', function() {
    vm.validate( "user_int", 
        { id : 123, pass : "R2d=" }
    ).should.equal(false);
  });    


  it('check bad int and password data', function() {
    vm.validate( "user_int", 
        { id : 123.1, pass : "r2D2" }
    ).should.eql({ '': 'Field "id" not matched with type "integer"',
            "": "Field \"pass\" not matched with type \"password\"" });
  });    

  it('register new bad model', function() {
    vm.registerModel( ).should.equal("Name is not defined");
  });


  it('check bad data', function() {
    vm.validate( "user", {
      id    : "61cecfb4-da43-4b65-aaa0-f1c3be81ec53",
      name  : { last: "Bagdanov", },
      metadata: { tt1:1, tt2:2 },
      createdAt : new Date(),
    }).should.eql({ '': 'Field "createdAt" not found in registered model',
      ',name': 'Field "first" is requied, but not found' });
  });    

    
});