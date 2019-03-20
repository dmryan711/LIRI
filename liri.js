//Imports
require("dotenv").config();
var keys = require("./keys.js");
var Spotify = require('node-spotify-api');
const axios = require('axios');
var moment = require('moment');

var spotify = new Spotify(keys.spotify);


//Command line variables
const CONCERT_THIS = "concert-this";
const SPOTIFY_THIS_SONG = "spotify-this-song";
const MOVIE_THIS = "movie-this";
const DO_WHAT_IT_SAYS = "do-what-it-says";

//Bands in town API (artist goes in the middle)
const BANDS_IN_TOWN_API_BASE = "https://rest.bandsintown.com/artists/";
const BANDS_IN_TOWN_API_KEY = "/events?app_id=codingbootcamp";

// User input
var command = process.argv[2];

var commandVar = getUserVar();

switch (command) {
    case CONCERT_THIS:
        var commandString = "";
        if(commandVar.length > 1){
            for(var i = 0; i < commandVar.length;i++){
                if(i == commandVar.length -1){
                    commandString += commandVar[i];
                }else{
                    commandString += commandVar[i] + "+";
                }
            }
            console.log(commandString);
            concerThis(commandString);
        }else{
            console.log(commandString);
            concerThis(commandVar[0]);
        }
        
      
        break; 
    case SPOTIFY_THIS_SONG:
      
        break; 
    case MOVIE_THIS:

        break;

    case DO_WHAT_IT_SAYS:
        break;

    default: 
      
  }

  //get user info

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
  //Bands in town function
  function concerThis(bandOrSongString){
     
    console.log(BANDS_IN_TOWN_API_BASE + bandOrSongString + BANDS_IN_TOWN_API_KEY);
    axios.get(BANDS_IN_TOWN_API_BASE + bandOrSongString + BANDS_IN_TOWN_API_KEY)
  .then(function (response) {
    //console.log(response);

    var data = response.data;
   
    data.forEach(element => {
        console.log("Venue Name: "+element.venue.name);
        console.log("Venue City: "+element.venue.city);
        console.log("Venue Region: "+element.venue.region);
        var date =  moment(element.datetime).format('MM-DD-YYYY');
        console.log("Event Date: "+ date);
        console.log("<--------------------------------------------->");
    });

    
  })
  .catch(function (error) {
    console.log(error);
  });

  }

  
  