// server.js
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const authController=require('./controllers/userController')
const UsersData = require('./model/userModel'); // Import User model
require('dotenv').config();
const stripe=require('stripe')('pk_test_51PvErEA4DK0HJcH8zfascLTdUvoAQ75cbNDDvusJsujZgyJezgABMkxmPPrzUPB1byOzgPJOixwtzYc600jMmKr5000DBjAYdy')
const app = express();
const port = 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({extended:false}))


mongoose.connect("mongodb://localhost:27017/E-Commerce-Swarn")
    .then(() => console.log("MongoDB is Connected"))
    .catch(e => console.error("Error in MongoDB connection:", e));
app.post('/login',authController.login);
app.post('/register',authController.signin)

// app.post('/payment',async(req,res)=>{
//     const product=await 
// })
// Start server
app.listen(port, () => {
    console.log(`Server is running at port ${port}`);
});
