var mongoose = require('mongoose');
var schema = mongoose.Schema;


var category = new schema({
    categoryName : { type: String, required: true, unique: true },
    isDelete: { type: Boolean, default: false }
},{
    timestamps:true
});

var Category = mongoose.model('category', category);

module.exports = {
    Category
}