//Imports
require("dotenv").config();
var keys = require("./keys.js");
var Spotify = require('node-spotify-api');
const axios = require('axios');
var moment = require('moment');

//console.log(keys);



//Command line variables
const CONCERT_THIS = "concert-this";
const SPOTIFY_THIS_SONG = "spotify-this-song";
const MOVIE_THIS = "movie-this";
const DO_WHAT_IT_SAYS = "do-what-it-says";

//Bands in town API (artist goes in the middle)
const BANDS_IN_TOWN_API_BASE = "https://rest.bandsintown.com/artists/";
const BANDS_IN_TOWN_API_KEY = "/events?app_id=codingbootcamp";

//OMDB API
const OMDB_API_BASE ="http://www.omdbapi.com/";
const OMDB_API_KEY = "?apikey=" +keys.apiKeys.omdbKey+"&t=";

http://www.omdbapi.com/?apikey=6f88e0ad&t=Back+to+the+future


// User input
var command = process.argv[2];
var commandVar = getUserVar();

switch (command) {
    case CONCERT_THIS:
     concerThis(unPackCommandVar(commandVar));
           
        break; 
    case SPOTIFY_THIS_SONG:
        spotifyThis(unPackCommandVar(commandVar));

        break; 
    case MOVIE_THIS:
        movieThis(unPackCommandVar(commandVar));

        break;

    case DO_WHAT_IT_SAYS:
        break;

    default: 
      
  }

  //get user info, can be used for all commands, helps with multiple variables after command 
  //ASSUMES COMMAND IS ALWAYS ONE WORD
  function getUserVar(){
      var userVarArray =[];
      if(process.argv.length > 3){
          for(var i = 3;i < process.argv.length;i++){
            userVarArray.push(process.argv[i]);
          }
          return userVarArray;
      }else{
          userVarArray.push(process.argv[3]);
          return userVarArray;
      }
  }

  function unPackCommandVar(commandArray){
    var commandString = "";
    if(commandArray.length > 1){
        for(var i = 0; i < commandArray.length;i++){
            if(i == commandArray.length -1){
                commandString += commandArray[i];
            }else{
                commandString += commandArray[i] + "+";
            }
        }
    }else{
        console.log(commandString);
        commandString += commandArray[0];
    }
    return commandString;
  }
  //BANDS IN TOWN
  function concerThis(bandOrSongString){
     
    //console.log(BANDS_IN_TOWN_API_BASE + bandOrSongString + BANDS_IN_TOWN_API_KEY);
    axios.get(BANDS_IN_TOWN_API_BASE + bandOrSongString + BANDS_IN_TOWN_API_KEY)
  .then(function (response) {

    var data = response.data;
    if(data.length <= 0){
        console.log("Sorry nothing found!");
    }else{
        data.forEach(element => {
            console.log("Venue Name: "+element.venue.name);
            console.log("Venue City: "+element.venue.city);
            var date =  moment(element.datetime).format('MM-DD-YYYY');
            console.log("Event Date: "+ date);
            console.log("<--------------------------------------------->");
        });
    
    }
   
    
  })
  .catch(function (error) {
    console.log(error);
  });
  }

  //SPOTIFY
  function spotifyThis(trackOrArtistString){
    var spotify = new Spotify(keys.apiKeys.spotify);
    if (trackOrArtistString == "" || trackOrArtistString == "undefined"){
        trackOrArtistString = "Ace of Base The Sign";
    }
    console.log("This is what I am passing "+ trackOrArtistString);
    spotify.search({ type: 'track', query: trackOrArtistString }, function(err, data) {
        if (err) {
          return console.log('Error occurred: ' + err);
        }
        var spotifyArray = data.tracks.items;
        spotifyArray.forEach(element => {
            console.log("<-------------------------------------------------------------------------------------------------->");
            console.log("Album Name: "+element.album.name);
            console.log("Artist Name: "+element.artists[0].name); 
            console.log("Song Name: "+element.name); 
            console.log("Spotify Link: " + element.external_urls.spotify);

        });

       
      });
  }

  //OMDB
  function movieThis(movieNameString){
    console.log(OMDB_API_BASE+OMDB_API_KEY+movieNameString);
    axios.get(OMDB_API_BASE+OMDB_API_KEY+movieNameString)
    .then(function (response){
       // console.log(response.data);
        var movie =  response.data;
        console.log("Title: "+movie.Title);
        console.log("Year: "+movie.Year);
        console.log("IMDB Rating: "+movie.imdbRating);
        if(movie.Ratings.length >=2){
            console.log("Rotten Tomatoes: "+movie.Ratings[1].Value);
        }else{
            console.log("Rotten Tomatoes rating is not available");
        }
        
        console.log("Country: "+movie.Country);
        console.log("Language: "+movie.Language);
        console.log("Plot: "+movie.Plot);
        console.log("Actors: "+movie.Actors);

        
    })
    .catch(function(error){
        console.log(error);
    });

  }

  
