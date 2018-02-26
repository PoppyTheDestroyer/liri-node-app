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
        case "tweets":
            getTweets();
            break;

        case "spotify":
        getSpotify(secondRequest);
            break;

        case "movie-this":
            getMovie();
            break;

        case "do-what-it-says":
            getTxt();
            break;
    }
}

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
            for(i=0; i<tweets.length; i+=1) {
            var date = tweets[i].created_at;
            console.log(`@jason_project5: ${tweets[i].text}\nCreated at: ${date.substring(0,19)}`);
            console.log("------------------");
            }
        }
    });
}

function getSpotify(song) {
    if(song===undefined) {
        song = "Life During Wartime";
    }
    var client = new spotify({
        id: webKeys.spotifyKeys.consumer_key,
        secret: webKeys.spotifyKeys.consumer_secret
    });

   client.search({type: "track", query: song}, function(error, data) {
       if(!error) {
           for(var i=0; i<5; i +=1) {
               var songData = data.tracks.items[i];
               //console.log (songData.album[0]);
               console.log(`\nArtist: ${songData.artists[0].name}\nSong: ${songData.name}\nPreview URL: ${songData.preview_url}\nAlbum: ${songData.album.name}\n`);
           }
       } else {
           console.log(error);
       }
   });
}

userCommand();