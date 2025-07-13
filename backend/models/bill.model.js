const mongoose = require('mongoose');

const billSchema = mongoose.Schema({
   username:{ type: String },
   name:{ type: String },
   items: [
     {
       product: { type: mongoose.Schema.Types.ObjectId, ref: 'product'},
       price: { type: Number }
     }
   ],
   totals:{type:Number},
   date:{type:Date , default:Date.now()}
})

module.exports = mongoose.model('bill',billSchema);
