const express = require('express');
const app = express();
const userRouter = require('./src/routes/users.routes'); 
const mongoose = require('mongoose');


// Connect to MongoDB
const url = process.env.mongoUrl;
mongoose.connect(url)
    .then(() => console.log("mongodb connected successfully"))
    .catch(error => console.log("error is ", error));

// Middleware
app.use(express.json());

// Use the routers
app.use('/', userRouter);

// Start the server
app.listen(process.env.port || 3000, () => {
    console.log("server is running successfully...");
});
     