var webKeys = require("./keys.js");
var twitter = require("twitter");
var spotify = require("node-spotify-api");
var request = require("request");
var fs = require("fs");

var userRequest = process.argv[2];
var secondRequest = process.argv[3];
for (i = 4; i < process.argv.length; i += 1) {
    secondRequest += "+" + process.argv[i];
}
function userCommand() {
    switch (userRequest) {
        case "my-tweets":
            getTweets();
            break;

        case "spotify-this-song":
            getSpotify();
            break;

        case "movie-this":
            getMovie();
            break;

        case "do-what-it-says":
            getTxt();
            break;
    }
};

function getTweets() {
    var client = new twitter({
        consumer_key: webKeys.twitterKeys.consumer_key,
        consumer_secret: webKeys.twitterKeys.consumer_secret,
        access_token_key: webKeys.twitterKeys.access_token_key,
        access_token_secret: webKeys.twitterKeys.access_token_secret
    });

    var params = {
        screen_name: "jason_project5",
        count: 20
    };

    client.get("statuses/user_timeline", params, function (error, tweets, response) {
        if (!error) {
            console.log(tweets);
        }
    });
};

function getSpotify() {
    var spotify = new Spotify({
        id: webKeys.spotifyKeys.consumer_key,
        secret: webKeys.spotifyKeys.consumer_secret
    });

    var searchSong;
    if (secondRequest === undefined) {
        searchSong = "The Sign"
    } else { searchSong = secondRequest }

    spotify.search({ type: "track", query: searchSong }, function (err, data) {
        if (err) {
            return console.log("Error occurred: " + err);
        }

        console.log(data);
    });
}

userCommand();