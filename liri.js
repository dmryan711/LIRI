//Imports
require("dotenv").config();
var keys = require("./keys.js");
var Spotify = require('node-spotify-api');
var spotify = new Spotify(keys.spotify);

//Command line variables
const CONCERT_THIS = "concert-this";
const SPOTIFY_THIS_SONG = "spotify-this-song";
const MOVIE_THIS = "movie-this";
const DO_WHAT_IT_SAYS = "do-what-it-says";