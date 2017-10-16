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
		//default if movie not provied
		if(media === ""){
		media = "Mr. Nobody"
		}
		//calling for the http request library
		var request = require("request");
		//dynamic queryUrl with media param
		queryUrl = "http://www.omdbapi.com/?t=" + media + "&y=&plot=short&apikey=40e9cece";
		//calling the request function and then using a callback function to display the data delivered
		request(queryUrl, function(error, response, body){
			if(!error){

			//circumstance that there is no Rotten Tomatoes Rating
			var rottenTomatoesRating = "No Rating"
			for (var i=0; i < JSON.parse(body).Ratings.length; i++) {
        		if (JSON.parse(body).Ratings[i].Source === 'Rotten Tomatoes') {
            	rottenTomatoesRating = JSON.parse(body).Ratings[i].Value
        		}
    		}
				console.log("-------------------------------------------------------------")
				console.log("Title:" + JSON.parse(body).Title)
				console.log("Year: " + JSON.parse(body).Year)
				console.log("IMDB Rating: " + JSON.parse(body).imdbRating)
				console.log("Rotten Tomatoes Rating: " + rottenTomatoesRating)
				console.log("Country: " + JSON.parse(body).Country)
				console.log("Language: " + JSON.parse(body).Language)
				console.log("Plot: " + JSON.parse(body).Plot)
				console.log("Actors: " + JSON.parse(body).Actors)
				console.log("-------------------------------------------------------------")
			}
			else{
				console.log(error)
			}
		})
	}
	else if(action === 'my-tweets'){
		//calling the twitter library 
		var Twitter = require('twitter');
		//referencing the twitterKeys file
		var twitterKeys = require("./twitter_keys.js");
		//creating an a new instance of the object when it's called
		var twitterObject = new Twitter(twitterKeys);
		//setting the parameters and using the twitter objects get method to retrieve/print tweets
		var params = {screen_name: 'nickvree'};
		twitterObject.get('statuses/user_timeline', params, function(error, tweets, response) {
			if (!error) {
				for(var i = 0; i < tweets.length;  i++){
					console.log("-------------------------------------------------------------")
					console.log(tweets[i].text)
					console.log("-------------------------------------------------------------")
				}
			}	
			//Developer account keeps getting logged out.  If it does, see error.  
			else{
					console.log(error)
			}
		});
	}
	else if(action === 'spotify-this-song'){
		//calling the spotify library
		var Spotify = require('node-spotify-api');
		//referencing the spotifyKeys file
		var spotifyKeys = require("./spotify_keys.js")
		//creating an a new instance of the object using the Spotify constructor
		var spotifyObject = new Spotify(spotifyKeys)
		//using the objects search method to query spotify and print the results
		spotifyObject.search({ type: 'track', query: media }, function(err, data) {
			if (err) {
				return console.log('Error occurred: ' + err);
			}

		console.log("-------------------------------------------------------------")
  		console.log(data.tracks.items[0].artists[0].name)
  		console.log(data.tracks.items[0].name)
  		console.log(data.tracks.items[0].preview_url)
  		console.log(data.tracks.items[0].album.name)
  		console.log("-------------------------------------------------------------") 
		});
	}
}

///////////////MAIN LOGIC//////////////////////

console.log(media)
//calling the filesystem library
var fs = require("fs")
//using a c	var fs = require("fs")onditional to check whether the commands should be taken directly from the CDL or from the file.
if(action === "do-what-it-says"){

	//using the readFile method to read the file and replace the contents of the argument
	fs.readFile("random.txt", "UTF8", function(err, data){
		if(err){
			console.log("Error!: " + err)
			return
		}
		//put text content into an array
		argumentArray = data.split(",")
		//reset the action and media
		action = argumentArray[0]
		media = argumentArray[1]
		//Bonus feature - log the values
		fs.appendFile("log.txt", action+" "+media+"\n")
		//run the rest of the program
		runAPIRequests()

	})
}
else{
	//Bonus feature - log the values
	fs.appendFile("log.txt", action+" "+media+"\n")
	//run the rest of the program
	runAPIRequests();
}