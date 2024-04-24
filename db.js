const { MongoClient } = require("mongodb");

let dbConnection;

module.exports = {
    //pass a callback func to this func that should run after the connection is established
    connectToDb: (cb) => {
        //this is an async task which returns a promise
        MongoClient.connect('mongodb://localhost:27017/bookstore')
        .then( (client) => {
            //an interface thru which we can interact with the db connected to
            dbConnection = client.db();
            return cb();
        })
        .catch( (err) => {
            console.log(err);
            return cb(err);
        });
    },
    //returns the db connection
    getDb: () => dbConnection
}