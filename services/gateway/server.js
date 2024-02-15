/*
Source:         server.js
Author:         Ekaterina Larchenkova
Dependencies:   npm install express morgan dotenv nodemon mongoose jsonwebtoken bcryptjs
*/

/* DEPENDENCIES */
//import our required dependencies
const express = require('express');
const morgan = require('morgan');

/*MONGO DB CONNECTION */
require('dotenv').config();
const mongoUri = process.env.MONGO_URI;
const connectDB = require('./config/db');
connectDB();

/* MIDDLEWARE */
//create express object (application) from Express module
const app = express();
//parse incoming requests as JSON
app.use(express.json());
//morgan middleware to the app for logging in dev mode
app.use(morgan('dev'));

//When the browser sends a GET request to http://localhost:PORT/
//server will execute the callback func
//set response code to 200 (success)
app.get('/', (req, res) => {
    res.status(200).send({
        //json message
        message: "Server running success, 200"
    });
});

//middleware to requests with this api endpoint to routes
app.use('/api/v1/HospitalEmployee', require('./routes/HospitalEmployeeRoutes.js'));

//start the server and always listen on port 7770
const port = process.env.PORT;
app.listen(port, () => {
    console.log(`Server started, listening on ${port}`);
});







