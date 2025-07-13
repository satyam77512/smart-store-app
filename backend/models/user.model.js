const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
    name: { type: String, required: true },
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    address:{type:String},
    Phone:{type:String},
    profileimage:{
        type:String,
        default:"default.png"
    },
    cart:[
        {
            type: mongoose.Schema.Types.ObjectId,
            ref :"product"
        }
    ],
    bills:[
         {
            type: mongoose.Schema.Types.ObjectId,
            ref :"bill"
        }
    ]
})

module.exports = mongoose.model('user',userSchema);

