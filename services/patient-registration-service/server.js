//connect to the database
const mongoose = require('mongoose');
require('dotenv').config();
const connect = require('./helpers/db');
connect();

//import express and create an express web server
const express = require('express');
const app = express();
//allow express app to accept JSON data
app.use(express.json());

//logging
const morgan = require('morgan');
app.use(morgan('dev'));

//import patient routes
const patientRoutes = require('./routes/patientRoutes');
//use version management for the API
app.use('/api/v1/patient', patientRoutes);

//start the server and listen on port 3002
app.listen(3002, () => console.log('Patient registration microservice running on port 3002'));

