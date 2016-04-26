var assert = require("assert");
var rx = require("rx");

describe("collection-like API", function() {

  var PRODUCTS = [
    { category: "Sports", price: 1000.0, title: "Camiseta de Boca" },
    { category: "Audio",  price: 3000.0, title: "Pasacasette para auto como nuevo" },
    { category: "Sports", price: 20.0,   title: "Pelota de tennis" },
  ];

  function questions(product) {
    return [
      `¿Cuánto cuesta ese ${product.title}?`,
      `¿Te sirven ${product.price * 0.8} en mano?`,
    ];
  }

  // simulamos requests remotos que tardan cierto tiempo
  function questionsAsync(product) {
    var waitTime = 100 * (1 + (2 * Math.random()));
    return rx.Observable.from(questions(product)).delay(waitTime);
  }

  before(function() {
    Array.prototype.flatMap = function(f) {
      return this.reduce(function(ret, x) { return ret.concat(f(x)) }, []);
    }
  });

  it("can be transformed with common collection operators", function(done) {
    rx.Observable.from(PRODUCTS)
                 .filter(function(p) { return p.category === "Sports"; })
                 .map(function(p)    { return p.price; })
                 .sum()
                 .subscribe(function(result) {
                   assert.equal(1020.0, result);
                   done();
                 });
  });

  it("can be transformed with common collection operators (cont.)", function(done) {
    var expectedQuestions = PRODUCTS.flatMap(questions);

    var observable = rx.Observable.from(PRODUCTS);

    // ordenamos los resultados para comparar ya que las respuestas
    // pueden haber venido desordenadas
    observable.flatMap(questionsAsync)
              .toArray()
              .subscribe(function(allQuestions) {
                assert.deepEqual(expectedQuestions.sort(), allQuestions.sort());
                done();
              });

    // sutileza: si usamos concatMap en vez de flatMap podemos asumir
    // que las respuestas están en orden. buscar los marble diagrams
    // de cada operación para visualizarlo
     observable.concatMap(questionsAsync)
               .toArray()
               .subscribe(function(allQuestions) {
                 assert.deepEqual(expectedQuestions, allQuestions);
                 done();
               });
  });

});

