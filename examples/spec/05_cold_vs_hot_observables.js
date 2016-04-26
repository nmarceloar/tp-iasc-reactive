var assert = require("assert");
var Promise = require("bluebird");
var rx = require("rx");

describe("Cold vs. Hot observables", function() {

  // Devuelve una promise que se satisface con el listado
  // de valores que ve un nuevo observable.
  function observeResults(observable) {
    var deferred = Promise.defer();
    var result = []
    observable.subscribe(
      function(x) { result.push(x); },
      null,
      function() { deferred.resolve(result) }
    )
    return deferred.promise;
  }


  describe("Cold observables", function() {

    it("notifies every observer of all items", function(done) {
      var answers = rx.Observable.from(["Nicolás", "Franco"]);

      observeResults(answers)
      .then(function(r1) {
        assert.deepEqual(["Nicolás", "Franco"], r1);

        // suscribo un nuevo observer una vez que el anterior terminó.
        observeResults(answers).then(function(r2) {
          // el segundo observer también ve todos los valores.
          assert.deepEqual(["Nicolás", "Franco"], r2);
          done();
        });
      });

    });

  });

  describe("Hot observables", function() {

    it("notifies every observer of all items", function(done) {
      var subject = new rx.Subject();
      var answers = subject.asObservable();

      o1 = observeResults(answers);

      subject.onNext("Nicolás");

      o2 = observeResults(answers);

      subject.onNext("Franco");
      subject.onCompleted();

      o1.then(function(r1) {
        assert.deepEqual(["Nicolás", "Franco"], r1);
      });

      o2.then(function(r2) {
        assert.deepEqual(["Franco"], r2);
      });


      Promise.all([o1,o2]).then(function() { done() });
    });

  });

});
