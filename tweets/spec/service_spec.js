var assert = require("assert");
var Promise = require("bluebird");
var Service = require("../src/service.js");
var dataset = require("../src/fake_dataset.js");

describe("Service API", function() {

  var service = new Service({
    delayResponse: false,
    successRate: 1.0
  });

  it("notifies when all results are ready", function(done) {
    service.getAllTweets()
           .then(function(response) {
             assert.equal(dataset, response);
             done();
           });
  });

  it("allows to request a single page", function(done) {
    var baseDate = new Date(2006,1,1);
    service.getTweets(baseDate, 10)
           .then(function(response) {
             assert.deepEqual(dataset.slice(0,10), response);
             done();
           });
  });

})
