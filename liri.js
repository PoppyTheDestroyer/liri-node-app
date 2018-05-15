var webKeys = require("./keys.js");
var twitter = require("twitter");
var spotify = require("node-spotify-api");
var fs = require("fs");
var inquirer = require("inquirer");
var request = require("request");

function userCommand() {
  inquirer
    .prompt([
      {
        type: "list",
        message: "What would you like to do?",
        choices: [
          "View Jason's Tweets (they're not good)",
          "Look up info about a song on Spotify",
          "Look up info about a movie on IMDB (through OMDB)",
          "Exit"
        ],
        name: "begin"
      }
    ])

    .then(function(inquirerResponse) {
      if (inquirerResponse.begin === "View Jason's Tweets (they're not good)") {
        getTweets();
      }
      if (inquirerResponse.begin === "Look up info about a song on Spotify") {
        getSpotify();
      }
      if (
        inquirerResponse.begin ===
        "Look up info about a movie on IMDB (through OMDB)"
      ) {
        getMovie();
      }
      if (inquirerResponse.begin === "Exit") {
        "quit";
      }
    });
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

  client.get("statuses/user_timeline", params, function(
    error,
    tweets,
    response
  ) {
    if (!error) {
      for (i = 0; i < tweets.length; i += 1) {
        var date = tweets[i].created_at;
        console.log(
          `@jason_project5: ${tweets[i].text}\nCreated at: ${date.substring(
            0,
            19
          )}`
        );
        console.log("------------------");
      }
    }
    userCommand();
  });
}

function getSpotify() {
  inquirer
    .prompt([
      {
        name: "song",
        type: "input",
        message: "What song would you like to look up?"
      }
    ])
    .then(function(inquirerResponse) {
      if (inquirerResponse.song === "") {
        song = "Life During Wartime";
      } else {
        song = inquirerResponse.song;
      }
      var client = new spotify({
        id: webKeys.spotifyKeys.consumer_key,
        secret: webKeys.spotifyKeys.consumer_secret
      });

      client.search({ type: "track", query: song }, function(error, data) {
        if (!error) {
          for (var i = 0; i < 5; i += 1) {
            var songData = data.tracks.items[i];
            //console.log (songData.album[0]);
            console.log(
              `\nArtist: ${songData.artists[0].name}\nSong: ${
                songData.name
              }\nPreview URL: ${songData.preview_url}\nAlbum: ${
                songData.album.name
              }\n`
            );
          }
        } else {
          console.log(error);
        }
        userCommand();
      });
    });
}
function getMovie() {
  inquirer
    .prompt([
      {
        name: "movie",
        type: "input",
        message: "What movie would you like to look up?"
      }
    ])
    .then(function(inquirerResponse) {
      if (inquirerResponse.movie === "") {
        title = "Goon";
      } else {
        title = inquirerResponse.movie;
      }
     request(`http://www.omdbapi.com/?t=${title}&apikey=${webKeys.movieKeys.consumer_key}`, (err, req, body) => {
          if (!err && req.statusCode === 200) {
            var jsonData = JSON.parse(body);
            if (jsonData.Response === "False") {
              console.log(
                "Sorry, this title cannont be found because OMDB is vastly inferior to IMDB."
              );
            } else {
              console.log(
                `Title: ${jsonData.Title}\nYear: ${
                  jsonData.Year
                }\nIMDB Rating: ${
                  jsonData.Ratings[0].Value
                }\nRotten Tomatoes Rating: ${
                  jsonData.Ratings[1].Value
                }\nCountry: ${jsonData.Country}\nPlot: ${
                  jsonData.Plot
                }\nStarring: ${jsonData.Actors} `
              );
            }
            userCommand();
          }
        }
      );
    });
}

userCommand();
