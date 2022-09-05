const mongodb = require("mongodb");
const URL = 'mongodb+srv://yanatska:yoOi3mxnL5e9q9eO@cluster0.dhyuhhv.mongodb.net/?retryWrites=true&w=majority';

let _db;
const MongoClient = mongodb.MongoClient;

const mongoConnect = (callback) => {
    return MongoClient.connect(URL)
    .then(client => {
        _db = client.db();
        callback();
    })
    .catch(err => {
        throw err
    })
};
const getDB = () => {
    if(_db) return _db
    throw "No database!";
}
module.exports = {mongoConnect, getDB};