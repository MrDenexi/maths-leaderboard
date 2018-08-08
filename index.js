
const express = require('express');

const app = express();
const port = process.env.PORT || 8002;

app.post('/submit', (req, res) => {
    
    //get token (Authorization Bearer)
    let bearerToken = req.headers["authorization"]          //get Authorization header.
    let bearerTokenSpl = bearerToken.split[' ']             //split
    if (bearerTokenSpl[0].toLowerCase == 'bearer' && req.headers["content-type"].toLowerCase == ){
        let tokenb64 = bearerTokenSpl[1]                    //starts with 'bearer'? -> save token
    else res.status(400).send('Could not retrieve token.'); //else -> error
    
    //hash token (digest)
    let token = Buffer.from(tokenb64, 'base64');            //convert base64 to bytes  
    let hash = crypto.createHash('sha256');                 //create  hash
    hash.update(token)                                      //add token to hash
    let tokenDigest = hash.digest('base64')                 //convert hash back to base64
    
    //compare tokenDigest to database
    console.log(tokenDigest);
    
    //insert and update database
})


// Leaderboard
app.get('/*', (req, res) => {
    function getPlayers(callback){
        players = 'hoi';
        callback(players);
    }
    getPlayers((result) => res.send(result));
});

app.listen(port, () => console.log(`Listening on port ${port}`));