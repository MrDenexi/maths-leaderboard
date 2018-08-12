const crypto = require('crypto');

const token = crypto.randomBytes(32);
const hash = crypto.createHash('sha256');
hash.update(token);

const tokenb64 = token.toString('base64')
const digestobj = {token: hash.digest('base64')};

let MongoClient = require('mongodb').MongoClient;
let url = "mongodb://localhost:27017/maths";

function saveToken(callback){
    MongoClient.connect(url, (err, db) => {
        if (err) throw err;
        let dbo = db.db("maths");
        dbo.collection("tokens").drop()
            .then(() => console.log("All previous tokens deleted from database."))
            .catch((err) => console.log('Error! ' + err));
        dbo.collection("tokens").insertOne(digestobj)
            .then(() => {
                console.log("New token saved in database.");
                callback(tokenb64);
                db.close();
            })
            .catch((err) => {
                console.log(err);
                db.close();
            });
    });
}

saveToken((t) => {
    console.log(
        `Save your ${token.length} bytes token: ${t}`
      );
})
