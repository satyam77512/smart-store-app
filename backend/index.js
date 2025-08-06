const express = require('express');
const app = express();
const connectToMongo = require("./database/db");

connectToMongo();

var cors = require("cors");

app.use(cors())
app.use(express.json());

app.use("/user/auth", require("./routes/Auth.routes"));
app.use("/user/product",require("./routes/Product.routes"));
app.use("/user/pay",require("./routes/Payment.routes"));

app.get("/health",(req,res)=>{
  return res.status(200).json({message:"backend is running"});
})


app.listen(3000);