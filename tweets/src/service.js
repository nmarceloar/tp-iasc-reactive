


var Promise = require('bluebird');
var _ = require('lodash');

var dataset = require('./fake_dataset'); // 1000 tweets ordenados por fecha 

function Service(opts) {

  opts = opts || {};

  this.delayResponse = true;

  if (opts.delayResponse != undefined) {
    this.delayResponse = opts.delayResponse;
  }

  this.successRate = opts.successRate || 0.8;

};

Service.prototype.getAllTweets = function() {

  return Promise.resolve(dataset);

}

Service.prototype.getTweets = function(since, count) {

  if (this._success()) {

    var response = this._computePage(since, count);

    return Promise.resolve(response).delay(this._delay());

  } else {

    return Promise.reject("internal server error");

  }

}

Service.prototype.baseDate = function() {

  return new Date(2006,1,1);

}

Service.prototype._computePage = function(since, count) {

  var inRange = dataset.filter(function (tweet) { return tweet.date > since; });

  return _.take(inRange, count);

}

Service.prototype._delay = function() {

  return this.delayResponse * 1000 * (1 + (2 * Math.random()));

}

Service.prototype._success = function() {

  return this.successRate > Math.random();

}


module.exports = Service
