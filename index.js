const express = require('express');
const bodyParser = require('body-parser')

const app = express();
const port = process.env.PORT || 8002;

const crypto = require('crypto');

let MongoClient = require('mongodb').MongoClient;
let murl = "mongodb://localhost:27017/maths";

// parse application/json
const jsonParser = bodyParser.json()

app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
    next();
});

app.post('/submit', jsonParser, (req, res) => {
    console.log(req.body);
    // get token (Authorization: Bearer) and check format     
    let bearerToken = req.get('authorization');             //get Authorization header.
    let bearerTokenSpl = bearerToken.split(' ');            //split
    let tokenb64 = '';       
    if (!bearerToken || bearerTokenSpl[0].toLowerCase() == 'bearer')          //'bearer' ok? -> save token
        tokenb64 = bearerTokenSpl[1];                     
    else {                                                  //else -> error
        res.status(400).send('Could not retrieve token.');  
        return;
    }
    let contype = req.headers["content-type"];
    if (!contype ||  contype.indexOf('application/json') != 0){
        console.log('wrong content-type');
        res.sendStatus(400);
        return;
    }
        
    // hash token (digest)
    let token = Buffer.from(tokenb64, 'base64');            //convert base64 to bytes  
    let hash = crypto.createHash('sha256');                 //create  hash
    hash.update(token);                                     //add token to hash
    let tokenDigest = hash.digest('base64');                //convert hash back to base64
    
    // compare tokenDigest to database
    function findToken(callback){   // find token, return true or false in callback.
        MongoClient.connect(murl, (err, db) => {
            if (err) {
                console.log('Error! ' + err)
                res.sendStatus(500);  
                return;
            }
            let dbo = db.db("maths");
            let result = dbo.collection("tokens").find({token: tokenDigest}).limit(1);
            result.hasNext().then( (found) => callback(found))
            .catch((err) =>{
                console.log(err);
                res.sendStatus(500)
                return;
            })
            db.close();
        })
    }
    findToken( (trueIfFound) => {
        if (trueIfFound === false) {
            res.sendStatus(401);
            return;
        }
    });

    // insert and update database
    function upsertDb(callback){
        MongoClient.connect(murl, (err, db) => {
            if (err) {
                console.log('Error! ' + err)
                res.sendStatus(500);  
                return;
            }
            let dbo = db.db("maths");
            /*
            req.body.forEach(element => {
                dbo.collection("players").update(
                    {_id: element._id},
                    {_id: element._id,  $inc:{answers: element.answers} },
                    {upsert: true}
                )
                .then(() => console.log('inserted'))
                .catch((err) => {
                    console.log(err);
                    res.sendStatus(500);  
                    return;
                });
            });
            db.close();
            callback();
            */
        });
    }
    upsertDb( () => {
        console.log('upsert finshed')
        res.sendStatus(418)
        return;
    });

});


// Leaderboard
app.get('/*', (req, res) => {
    function getPlayers(callback){
        players = 'hoi';
        callback(players);
    }
    getPlayers((result) => res.send(result));
});

app.listen(port, () => console.log(`Listening on port ${port}`));