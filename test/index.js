var should = require('chai').should(),
    vm = require('../index'),
    types  = vm.types,
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
            first : { type: "string", min: 1, max: 256 },
            last  : { type: "string", min: 1, max: 256 },
        },
        email: { type: "email" },
        metadata: { type: "object" },
    }).should.equal(1);
  });    

  it('check good data', function() {
    vm.validate( "user", {
      id    : "61cecfb4-da43-4b65-aaa0-f1c3be81ec53",
      name  : { first : "Alex", last: "Bagdanov", },
      metadata: { tt1:1, tt2:2 },
    }).should.equal(true);
  });    


  it('check bad data', function() {
    vm.validate( "user", {
      id    : "61cecfb4-da43-4b65-aaa0-f1c3be81ec53",
      name  : { first2 : "Alex", last: "Bagdanov", },
      metadata: { tt1:1, tt2:2 },
      createdAt : new Date(),
    }).should.equal(false);
  });    

    
});