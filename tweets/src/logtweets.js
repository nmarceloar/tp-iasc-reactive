



var Rx = require('rx'); 
var _ = require('lodash'); 
var assert = require('assert'); 

var dataset = require('./fake_dataset'); // 1000 tweets ordenados por fecha 

var pairs = []; 

var coldTweets = Rx.Observable.from(dataset); 

function hashtags(tweet) { 

	return tweet.text.split(' ').filter(st => st.startsWith('#')); 

} 

function includes(array, value) { 

	if(Array.isArray(array))
		return array.indexOf(value) !== -1; 

	throw new Error(`${array} parameter is not of type Array`); 


}

var tweetsByHashtag = coldTweets
		.flatMap(hashtags)
		.map(hashtag => ({name: hashtag, count: 1}))
		.groupBy(tagcount => tagcount.name)
		.flatMap(taggroup => taggroup.reduce((a,x) => ({tag: x.name, count: (a.count + x.count)}))); 

tweetsByHashtag.subscribe(function(pair){

	coldTweets
		.filter(tweet => includes(hashtags(tweet), pair.tag)) 
		.count()
		.subscribe(count =>  { assert.strictEqual(pair.count, count) })

}); 


