const express = require('express');
const bodyParser = require('body-parser')

const app = express();
const port = process.env.PORT || 8002;

const crypto = require('crypto');

let MongoClient = require('mongodb').MongoClient;
let murl = "mongodb://localhost:27017/maths";

const jsonParser = bodyParser.json() // parse application/json

app.set('view engine', 'pug'); // use pug views
app.use(express.static('static'));

app.use(function(req, res, next) { // do header stuff
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
    next();
});

app.post('/submit', jsonParser, (req, res) => {
    console.log('POST /submit')
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
    function upsertDb(){
        let somekindoferror;
        MongoClient.connect(murl, (err, db) => {    //connect to mongodb
            if (err) {                              //random errorblock because we can
                console.log('Error! ' + err)
                somekindoferror = err;
                return;
            }

            for(let i = 0; i < req.body.length; i++) {  //loop through all player objects.
                let el = req.body[i];                   //selecting element
                if(!el) continue;                       //go to next element of loop if it's empty;
                let dbo = db.db("maths");

                function escapeRegExp(string) {      
                    return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'); // $& means the whole matched string
                }

                dbo.collection("players").find({name: {$regex: new RegExp('^'+ escapeRegExp(el.name) + '$', "i")} }).limit(1).toArray()   //check if player is already in db
                .then((foundPlayer) => {
                    console.log(foundPlayer);
                    if (foundPlayer.length > 0){   //if player is in database -> update answers of player
                        console.log('update', foundPlayer[0]._id, foundPlayer[0].name);
                        console.log('putting this in there', el);
                        dbo.collection("players").update(
                            {_id: foundPlayer[0]._id},
                            {
                                $inc:{answers: el.answers},
                                $set:{
                                    name: el.name,
                                    flair: el.flair,
                                    date: el.date
                                }
                            }                           
                        )
                        .then(() => console.log('updated',foundPlayer[0]._id, foundPlayer[0].name))
                        .then(() => { if(i == req.body.length - 1) endUpsert(db, somekindoferror)}) //check if this was the last one -> go to endUpsert
                        .catch((err) => {
                            console.log('Error at updating', el.name , err);
                            somekindoferror = err;
                        });
                    }
                    else{   //if player is not in database 
                        dbo.collection("players").insertOne(el)
                        .then(() => console.log('inserted', el._id))
                        .then(() => { if(i == req.body.length - 1) endUpsert(db, somekindoferror)}) //check if this was the last one -> go to endUpsert
                        .catch((err) => {
                            console.log('Error at inserting', el._id, err);
                            somekindoferror = err;
                        });
                    }
                })
                .catch((err) => {
                    console.log(err);
                });          
            }
        });
    }
    function endUpsert(db, somekindoferror){
        let status
        somekindoferror ? status = 400 : status = 200; //check for errormessages, and replace status.
        res.sendStatus(status);
        db.close();
        return;
    }
    upsertDb();
});


// Leaderboard
app.get('/*', (req, res) => {
    console.log('GET /*');
    function getPlayers(callback){ //get player data from 
        MongoClient.connect(murl, (err, db) => {
            let dbo = db.db("maths");
            dbo.collection("players").find().sort({answers: -1})
            .toArray((err, result) => {
                if (err) console.log(err);
                callback(result);
            })
        });
    }
    getPlayers((result) => res.render('index', {players: result}));
});

app.listen(port, () => console.log(`Listening on port ${port}`));