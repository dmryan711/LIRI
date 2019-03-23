//Imports
require("dotenv").config();
var keys = require("./keys.js");
var Spotify = require('node-spotify-api');
const axios = require('axios');
var moment = require('moment');



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
     concerThis(unPackCommandVar(commandVar));
           
        break; 
    case SPOTIFY_THIS_SONG:
        spotifyThis(unPackCommandVar(commandVar));

        break; 
    case MOVIE_THIS:

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
     
    console.log(BANDS_IN_TOWN_API_BASE + bandOrSongString + BANDS_IN_TOWN_API_KEY);
    axios.get(BANDS_IN_TOWN_API_BASE + bandOrSongString + BANDS_IN_TOWN_API_KEY)
  .then(function (response) {

    var data = response.data;
    data.forEach(element => {
        console.log("Venue Name: "+element.venue.name);
        console.log("Venue City: "+element.venue.city);
        var date =  moment(element.datetime).format('MM-DD-YYYY');
        console.log("Event Date: "+ date);
        console.log("<--------------------------------------------->");
    });

    
  })
  .catch(function (error) {
    console.log(error);
  });
  }

  //SPOTIFY
  function spotifyThis(trackOrArtistString){
    var spotify = new Spotify(keys.spotify);
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

  
//   { album:
//     { album_type: 'album',
//       artists: [ [Object] ],
//       available_markets:
//        [ 'AD',  
//          'ZA' ],
//       external_urls:
//        { spotify: 'https://open.spotify.com/album/3nduqOkFEshUlTzpv3HGyP' },
//       href: 'https://api.spotify.com/v1/albums/3nduqOkFEshUlTzpv3HGyP',
//       id: '3nduqOkFEshUlTzpv3HGyP',
//       images: [ [Object], [Object], [Object] ],
//       name: 'Boob Ranch: Lullaby renditions of Blink 182 songs',
//       release_date: '2014',
//       release_date_precision: 'year',
//       total_tracks: 10,
//       type: 'album',
//       uri: 'spotify:album:3nduqOkFEshUlTzpv3HGyP' },
//    artists:
//     [ { external_urls: [Object],
//         href: 'https://api.spotify.com/v1/artists/2VURgzr9TpBmYJEqU25RUw',
//         id: '2VURgzr9TpBmYJEqU25RUw',
//         name: 'Sparrow Sleeps',
//         type: 'artist',
//         uri: 'spotify:artist:2VURgzr9TpBmYJEqU25RUw' } ],
//    available_markets:
//     [ 'AD',
    
//       'ZA' ],
//    disc_number: 1,
//    duration_ms: 245263,
//    explicit: false,
//    external_ids: { isrc: 'QM-4NN-15-10063' },
//    external_urls:
//     { spotify: 'https://open.spotify.com/track/0dqJ9yOWOwlNSBPvTb5Jh7' },
//    href: 'https://api.spotify.com/v1/tracks/0dqJ9yOWOwlNSBPvTb5Jh7',
//    id: '0dqJ9yOWOwlNSBPvTb5Jh7',
//    is_local: false,
//    name: 'All the Small Things',
//    popularity: 18,
//    preview_url:
//     'https://p.scdn.co/mp3-preview/322d406888fb9a502339dcce81d104f1d1faa230?cid=99a2728ca7c64848ab2b64c2b833a231',
//    track_number: 3,
//    type: 'track',
//    uri: 'spotify:track:0dqJ9yOWOwlNSBPvTb5Jh7' }