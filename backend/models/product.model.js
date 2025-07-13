const mongoose = require('mongoose');

const productSchema = mongoose.Schema({
    name: { type: String, required: true },
    productId:{type:String , required:true},
    price:{type:Number,required:true},
    productDetails:{type:String},
    mDate:{type:Date},
    edate:{type:Date},
})

module.exports = mongoose.model('product',productSchema);
