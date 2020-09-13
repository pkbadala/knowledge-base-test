/****************************
 MONGOOSE SCHEMAS
 ****************************/
let config = require('./configs');
let mongoose = require('mongoose');
let env = require('dotenv').config();
mongoose.Promise  =  global.Promise;

module.exports = function() {
    var db = mongoose.connect(process.env.LOCAL_DB_URI, config.mongoDBOptions).then(
        () => { console.log('MongoDB connected') },
        (err) => { console.log('MongoDB connection error',err) }
    );

    //Load all Schemas
    require('../app/models/UserSchema');
    require('../app/models/CategorySchema');
    require('../app/models/ProductSchema');

    return db;
};
