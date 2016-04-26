var Service = require("./service");
var ObservableLayer = require("./observable_layer");

var service = new Service();
var tweets = ObservableLayer.tweets(service);

// mostrar un tweet cada 3000
tweets.sample(3000)
.subscribe(function(tweet) {
            console.log("---------------------------------------------------------------------");
            console.log("Sample tweet:")
            console.log(tweet);
            console.log("---------------------------------------------------------------------");
           },
           function(error) {
             console.log("An error occurred:");
             console.log(error);
           });

