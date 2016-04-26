var rx = require("rx");

var DEFAULT_PAGE_SIZE = 200;



function pages(service) {

	return rx.Observable.create(function(subscriber) {		

		function fetchPage(since, size) { 

			// reintentar solo si el error es conocido 

			return service.getTweets(since, size)
					.then(page => page)
					.catch(error => {

						if((typeof error === 'string') && (error === 'internal server error'))
							return fetchPage(since, size); 

						throw error;

					}); 

		}

		function fetchPages(since, size) { 

			fetchPage(since, size)
				.then(page => {

					if (page.length) {

						subscriber.onNext(page); 

						fetchPages(page[page.length -1].date, size); 

					} else { 

						subscriber.onCompleted(); 

					}

				})
				.catch(error => { 

					subscriber.onError(error); 

				}); 

		}

		fetchPages(service.baseDate(), DEFAULT_PAGE_SIZE); 

	});

}


function tweets(service) {

	return rx.Observable.create(function(subscriber) {		

		service.getAllTweets()
					.then(tweets => {

						tweets.forEach(tweet => { 

							subscriber.onNext(tweet); 

						});

						subscriber.onCompleted(); 

					})
					.catch(err => { 

						subscriber.onError(err); 

					})

	});

}

module.exports = {

	pageSize: function() { return DEFAULT_PAGE_SIZE },
	pages: pages,
	tweets: tweets

}
