
const express = require('express');

const app = express();
const port = process.env.PORT || 8002;

app.post('/submit', (req, res) => {
    //get token (Authorization Bearer)
    //hash token
    //compare hash to database
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