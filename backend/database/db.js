require("dotenv").config();
const mongoose = require('mongoose');
const mongoURI = process.env.MONGODB_URI;
// ***note***
// mongodb connection string me jo "...majority" iske baad wala part remove kr dena
// ip address white listing 0.0.0.0/0
// @ replace by %40 in password

const connectToMongo = () => {
    mongoose.connect(mongoURI)
      .then(() => {
        console.log("Connected to MongoDB Successfully");
      })
      .catch((error) => {
        console.error("Error connecting to MongoDB", error);
      });
  };
  
  module.exports = connectToMongo;