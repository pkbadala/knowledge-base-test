var mongoose = require('mongoose');
var schema = mongoose.Schema;


var product = new schema({
    productName : { type:String, required: true, unique: true },
    productDescription : { type:String, required: true },
    productImage : { type:String, default:null },
    categoryId: { type: schema.Types.ObjectId, ref: 'Category' },
    isDeleted: { type:Boolean, default: false }    
},{
    timestamps:true
});

var Product = mongoose.model('product', product);

module.exports = {
    Product
}