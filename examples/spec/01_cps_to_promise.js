var assert = require("assert");
var Promise = require("bluebird");

describe("CPS / Promises conversion", function () {

  function inverseCPS(x, contOk, contFail) {
    if (x == 0) {
      contFail("Division by zero");
    } else {
      contOk(1/x);
    }
  }

  it("calculates inverse example (CPS)", function(done) {
    inverseCPS(2,
               function(result) {
                 assert.equal(0.5, result);
                 done();
               },
               function(error) {
                 done(error);
               }
              );
  })

  function inversePromise(x) {
    return new Promise(function(resolve, reject){
      if(x === 0) {
        reject("Division by zero");
      } else {
        resolve(1/x);
      }
    });
  }

  it("calculates inverse example (Promise)", function(done) {
    var promise = inversePromise(2)

    promise.then(
      function(result) {
        assert.equal(0.5, result);
        done();
      },
      function(error) {
        done(error);
      }
    );
  });

});
