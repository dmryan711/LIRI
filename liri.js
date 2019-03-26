//Imports
require("dotenv").config();
var keys = require("./keys.js");
var Spotify = require('node-spotify-api');
const axios = require('axios');
var moment = require('moment');
var fs = require('fs');
const chalk = require('chalk');


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



// User input
var command = process.argv[2];
if(process.argv.length <= 2){
    userErrorMessage();
}else if(command == CONCERT_THIS && process.argv.length == 3){
    userErrorMessage();

}else{
    var commandVar = getUserVar();
    runTool(command,unPackCommandVar(commandVar));
}

function runTool(command,urlFriendlyCommandVar){
    switch (command) {
        case CONCERT_THIS:
         concerThis(urlFriendlyCommandVar);
               
            break; 
        case SPOTIFY_THIS_SONG:
            spotifyThis(urlFriendlyCommandVar);
    
            break; 
        case MOVIE_THIS:
            movieThis(urlFriendlyCommandVar);
    
            break;
    
        case DO_WHAT_IT_SAYS:
            doWhatItSays();
            break;
    
        default: 
        userErrorMessage();


          
    }
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
        commandString += commandArray[0];
    }
    return commandString;
  }
  //BANDS IN TOWN
  function concerThis(bandOrSongString){
     
    axios.get(BANDS_IN_TOWN_API_BASE + bandOrSongString + BANDS_IN_TOWN_API_KEY)
  .then(function (response) {

    var data = response.data;
    if(data.length <= 0){
        console.log(chalk.yellow("Sorry nothing found!"));
    }else{
        data.forEach(element => {
            console.log(chalk.green.bold("Venue Name: ")+chalk.green(element.venue.name));
            console.log(chalk.green.bold("Venue City: ")+chalk.green(element.venue.city));
            var date =  moment(element.datetime).format('MM-DD-YYYY');
            console.log(chalk.green.bold("Event Date: ")+ chalk.green(date));
            console.log(chalk.magenta.bold("<--------------------------------------------->"));
        });
    
    }
   
    
  })
  .catch(function (error) {
    console.log(chalk.red(error));
  });
  }

  //SPOTIFY
  function spotifyThis(trackOrArtistString){
    var spotify = new Spotify(keys.apiKeys.spotify);
    if (trackOrArtistString == "" || trackOrArtistString == "undefined"){
        trackOrArtistString = "Ace of Base The Sign";
    }
    spotify.search({ type: 'track', query: trackOrArtistString }, function(err, data) {
        if (err) {
          return console.log(chalk.red('Error occurred: ' + err));
        }
        var spotifyArray = data.tracks.items;
        spotifyArray.forEach(element => {
            console.log(chalk.cyan.bold("<-------------------------------------------------------------------------------------------------->"));
            console.log(chalk.green.bold("Album Name: ")+chalk.green(element.album.name));
            console.log(chalk.green.bold("Artist Name: ")+chalk.green(element.artists[0].name)); 
            console.log(chalk.green.bold("Song Name: ")+chalk.green(element.name)); 
            console.log(chalk.green.bold("Spotify Link: ")+chalk.green(element.external_urls.spotify));

        });

       
      });
  }

  //OMDB
  function movieThis(movieNameString){
    if (movieNameString == "" || movieNameString == "undefined"){
        movieNameString = "Mr. Nobody";
    }
    axios.get(OMDB_API_BASE+OMDB_API_KEY+movieNameString)
    .then(function (response){
        var movie =  response.data;
        console.log(chalk.blue.bold("Title: ")+chalk.blue(movie.Title));
        console.log(chalk.blue.bold("Year: ")+chalk.blue(movie.Year));
        console.log(chalk.blue.bold("IMDB Rating: ")+chalk.blue(movie.imdbRating));
        if(movie.Ratings.length >=2){
            console.log(chalk.blue.bold("Rotten Tomatoes: ")+chalk.blue(movie.Ratings[1].Value));
        }else{
            console.log(chalk.blue.bold("Rotten Tomatoes rating is not available"));
        }
        
        console.log(chalk.blue.bold("Country: ")+chalk.blue(movie.Country));
        console.log(chalk.blue.bold("Language: ")+chalk.blue(movie.Language));
        console.log(chalk.blue.bold("Plot: ")+chalk.blue(movie.Plot));
        console.log(chalk.blue.bold("Actors: ")+chalk.blue(movie.Actors));

        
    })
    .catch(function(error){
        console.log(chalk.red(error));
    });

  }

  //Do What It Says - File Read
  function doWhatItSays(){
    fs.readFile('./random.txt', 'utf8', function(error, data){
        if(error){
            return console.log(chalk.red("Whoops looks like there was an error with random.txt"));
        }
        var splitData = data.split(',');
            if(splitData[0] == DO_WHAT_IT_SAYS){
                return console.log(chalk.red("Error: The file contains the command "+DO_WHAT_IT_SAYS));
            }else{
                var command = splitData[0];
                var splitVar = splitData[0+1].replace(/"/gi,'').split(" ");
                runTool(command,unPackCommandVar(splitVar));

            }

            //TRIED LOOPING THROUGH FILE, NOT WORKING
            // for(var i=0;i<splitData.length;i+=2){
            //     console.log(i);
            //     if(splitData[i] == DO_WHAT_IT_SAYS){
            //         return console.log("Error: The file contains the command "+DO_WHAT_IT_SAYS);
            //     }else{
            //         var command = splitData[i];
            //         var splitCommand = splitData[i+1].replace(/"/gi,'').split(" ");
            //         console.log(command);
            //         console.log(unPackCommandVar(splitCommand));
            //        runTool(command,unPackCommandVar(splitCommand));
                    
            //     }
            //  }
    });

    

  }

  function userErrorMessage(){
      console.log(chalk.red( "I am sorry, I only understand the following commands:\n1: "+SPOTIFY_THIS_SONG+" <SONG NAME> (If no song name, I default to 'Ace of Base')\n2: " +MOVIE_THIS+" <MOVIE NAME> (If no movie name, I default to 'Mr.Nobody')\n3: "+CONCERT_THIS+" <BAND NAME> (No default, you MUST include a band)\n4: "+ DO_WHAT_IT_SAYS));

  }

  
