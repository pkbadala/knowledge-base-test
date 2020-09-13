var mongoose = require('mongoose');
var schema = mongoose.Schema;

var user = new schema({
    userName : { type: String, required:true },
    email : { type: String, required:true, unique:true },
    password : { type: String },
    accessToken : { type: String },
    googleId : { type: String },
    googleIdToken : { type: String },
    googleToken : { type: String },
    isDelete: { type: Boolean, default: false },
},{
    timestamps:true
});

var User = mongoose.model('user', user);

module.exports = {
    User
}