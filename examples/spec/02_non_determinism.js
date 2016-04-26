var assert = require("assert");
var Promise = require("bluebird");
var rx = require("rx");

describe("non determinism", function() {

  describe("CPS", function() {

    function hijoDeVito(cont) {
      cont("sonny");
      cont("michael");
      cont("connie");
      cont("freddo");
    }

    it("allows to model non determinism", function() {
      var result = [];

      // aprovechamos que la función es sincrónica
      hijoDeVito(function(x) {
        result.push(x);
      });

      assert.deepEqual(['sonny', 'michael', 'connie', 'freddo'], result);
    });

  });

  describe("Promises", function() {

    function hijoDeVito() {
      return new Promise(function(resolve, reject){
        resolve("sonny");
        resolve("michael");
        resolve("connie");
        resolve("freddo");
      });
    }

    it("cannot be resolved multiple times", function(done) {
      var result = [];
      var promise = hijoDeVito();

      promise.then(function(x) { result.push(x) });

      // uno no debería escribir este tipo de código con promises, pero
      // utilizar 'then' acá podría dar lugar a pensar que los resultados
      // posteriores se agregan tras la verificación. damos un tiempo para
      // que quede claro que no es así.
      setTimeout(function() {
        assert.deepEqual('sonny', promise.value());
        assert.deepEqual(['sonny'], result);
        done();
      }, 100)
    });

  });

  describe("Observables", function() {

    function hijoDeVito() {
      return rx.Observable.create(function(observer) {
        observer.onNext("sonny");
        observer.onNext("michael");
        observer.onNext("connie");
        observer.onNext("freddo");
        observer.onCompleted();
      });
    };

    it("allows to model non determinism", function(done) {
      var result = [];

      hijoDeVito().subscribe(
        // onNext
        function(x) { result.push(x); },

        // onError
        null,

        // onComplete
        function() {
          assert.deepEqual(['sonny', 'michael', 'connie', 'freddo'], result);
          done();
        }
      )
    });

  });

});
