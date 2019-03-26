console.log('this is loaded');

exports.apiKeys = {
    spotify :{
        id: process.env.SPOTIFY_ID,
        secret: process.env.SPOTIFY_SECRET
    },
    omdbKey : process.env.OMDB_API_KEY
};

