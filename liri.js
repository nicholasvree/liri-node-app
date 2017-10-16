////////////VARIABLES//////////////////////
var action = process.argv[2]
var media = process.argv.splice(3).join(" ")

//Old code to deal with multiple word media arguments
// var fullCommand = process.argv
// //Get full name of media
// for(var i=3; i<fullCommand.length; i++){
// 	media = media+" "+fullCommand[i]
// }

//////////////FUNCTIONS///////////////////

function runAPIRequests(){
	if(action === 'movie-this'){

		var request = require("request");

		queryUrl =  "http://www.omdbapi.com/?t=" + media + "&y=&plot=short&apikey=40e9cece";

		request(queryUrl, function(error, response, body){
			console.log(JSON.parse(body))


			console.log("-------------------------------------------------------------")
			console.log("Title:" + JSON.parse(body).Title)
			console.log("Year: " + JSON.parse(body).Year)
			console.log("IMDB Rating: " + JSON.parse(body).imdbRating)
			console.log("Rotten Tomatoes Rating: " + JSON.parse(body).Ratings[1].Value)
			console.log("Country: " + JSON.parse(body).Country)
			console.log("Language: " + JSON.parse(body).Language)
			console.log("Plot: " + JSON.parse(body).Plot)
			console.log("Actors: " + JSON.parse(body).Actors)
			console.log("-------------------------------------------------------------")
		})
	}
	else if(action === 'my-tweets'){

		var twitterLibrary = require('twitter');

		var twitterKeys = require("./twitter_keys.js");

		var twitterObject = new twitterLibrary(twitterKeys);

		console.log("twitterlibrary" , twitterLibrary, "twitterObect", twitterObject, "twitterKeys")

		var params = {screen_name: 'nickvree'};
		twitterObject.get('statuses/user_timeline', params, function(error, tweets, response) {
			if (!error) {
				for(var i = 0; i < tweets.length;  i++){
					console.log("-------------------------------------------------------------")
					console.log(tweets[i].text)
					console.log("-------------------------------------------------------------")

				}
			}	
		});
	}
	else if(action === 'spotify-this-song'){

		var spotifyModule = require('node-spotify-api');

		var spotifyKeys = require("./spotify_keys.js")

		var spotifyPass = new spotifyModule(spotifyKeys)

		spotifyPass.search({ type: 'track', query: media }, function(err, data) {
			if (err) {
				return console.log('Error occurred: ' + err);
			}

		console.log("-------------------------------------------------------------")
 		 // console.log(data.tracks.items[0])
  		console.log(data.tracks.items[0].artists[0].name)
  		console.log(data.tracks.items[0].name)
  		console.log(data.tracks.items[0].preview_url)
  		console.log(data.tracks.items[0].album.name)
  		console.log("-------------------------------------------------------------") 
		});
	}
}

///////////////MAIN LOGIC//////////////////////

if(action === "do-what-it-says"){

	var fs = require("fs");

	fs.readFile("random.txt", "UTF8", function(err, data){
		if(err){
			console.log("Error!: " + err)
			return
		}

		argumentArray = data.split(",")

		action = argumentArray[0]
		media = argumentArray[1]

		runAPIRequests();

	})
}
else{
	runAPIRequests();
}