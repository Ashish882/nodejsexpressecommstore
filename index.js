const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const userroute = require('./routes/user');
const authroute = require('./routes/auth');
const productroute = require('./routes/product');
const cartroute = require('./routes/cart');
const orderroute = require('./routes/order');

dotenv.config();

mongoose.connect(process.env.MONGO_URI)
.then(() => {

console.log("Connected to database");

}).catch((err) => { 
    console.log(err); 
});


const app = express();
app.use(express.json());
app.use("/api/auth", authroute);
app.use("/api/user", userroute);
app.use("/api/products", productroute);
app.use("/api/carts", cartroute);
app.use("/api/orders", orderroute);

app.listen(process.env.PORT || 5000,()=>{
    console.log('server started');
})