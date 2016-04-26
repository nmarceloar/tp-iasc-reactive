



var assert = require("chai").assert; 
var Promise = require("bluebird");
var rx = require('rx');

var _ = require('lodash'); 

var Service = require("../src/service");

var dataset = require("../src/fake_dataset");

var ObservableLayer = require("../src/observable_layer");


var hashtags = tweet => tweet.text.split(' ').filter(word => word.startsWith('#')); 


describe("Observable layer", function() {

  var service = new Service({

    delayResponse: false,
    successRate: 0.15

  });



  describe("Pages observable", function() {

    it("eventually returns all tweets", function(done) {

      var tweetPageStream = ObservableLayer.pages(service);

      var result = []

      tweetPageStream.subscribe(
        // onNext
        function(page) {

          assert.equal(200,  page.length);
          result = result.concat(page);

        },
        // onError
        function(error) {

          assert.fail(error)

        },
        // onCompleted
        function() {

          assert.deepEqual(dataset, result);
          done();
          
        }
        )
    });

  });

  describe("Tweets observable", function() {

    it("eventually returns all tweets", function(done) {

      var result = [];

      var tweetStream = ObservableLayer.tweets(service);

      tweetStream.subscribe(
        // onNext
        function(tweet) {
          result.push(tweet);
        },
        // onError
        function(error) {
          assert.fail(error)
        },
        // onCompleted
        function() {
          assert.deepEqual(dataset, result);
          done();
        }
        )
    });
    
    it("allows to count tweets by hashtag", function(done) {

      var computedPairs = []; 

      var expectedPairs = _.map(_.groupBy(_.flatMap(dataset, hashtags)), group => ({
        hashtag: _.sample(group), count: _.size(group)
      })); 


      var tweetsByHashtag = 
             ObservableLayer.tweets(service)
                .flatMap(hashtags)
                .groupBy(hashtag => hashtag)
                .flatMap(group => group.reduce((pair,ht) => 
                    ({hashtag: ht, count: ( pair.count + 1 )}), 
                    {hashtag: undefined, count: 0})
                ); 


      tweetsByHashtag.subscribe(

          pair => { 

              computedPairs.push(pair);

          }, 

          err => { 

            assert.fail(err);

          }, 

          () => { 

              assert.strictEqual(expectedPairs.length, computedPairs.length); 
              assert.sameDeepMembers(expectedPairs, computedPairs); 

              done(); 

          }

      ); 



    });

  });

});
