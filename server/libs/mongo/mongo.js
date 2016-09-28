const co = require('co');
const { MongoClient } = require('mongodb');
const { mongoConfig } = require('../../config');

const { username, password, host, port, query, database } = mongoConfig;
const url = `mongodb://${username}:${password}@${host}:${port}/${database}${query}`;

console.log('========================================');
console.log('MONGO_CONNECT_URL =>', url);
console.log('========================================\n');

exports.connect = co.wrap(function *() {
    let db = null;

    try {
        db = yield MongoClient.connect(url);
        return db;
    } catch (err) {
        console.error({ err });
        db && db.close();
        throw err;
    }
});