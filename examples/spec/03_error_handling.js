var assert = require("assert");
var rx = require("rx");

describe("error handling", function() {

  it("calls error handler when something goes wrong", function(done) {
    var obs = rx.Observable.create(function(observer) {
      observer.onNext(1);
      throw new Error("ooops!");
    });

    results = [];

    obs.subscribe(
      function(x) { results.push(x) },

      // acá comprobamos que efectivamente se llama al handler de error
      function(error) {
        assert.equal("ooops!", error.message);
        assert.deepEqual([1], results);
        done()
      }, 

      function() { assert.fail() }
    );
  });

})
