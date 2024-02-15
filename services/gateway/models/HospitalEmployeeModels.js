//import mongoose
const mongoose = require('mongoose');

//import the Schema constructor from mongoose
const Schema = mongoose.Schema;

//an enum for genders
const genders = ['Male', 'Female'];
//an enum for types of employees or roles in hospital
const roles = ['Doctor', 'Nurse', 'Paramedic', 'Clerk'];

/*regex */
const goodPhone = /^\+971\d{9}$/;
//TODO: requires thorough testing
//BUG: not accepting emails with letetrs+numbers
//source: https://piyush132000.medium.com/mastering-email-validation-in-javascript-multiple-approaches-ae718546160b
const goodEmail = /^[a-zA-Z0–9._-]+@[a-zA-Z0–9.-]+\.[a-zA-Z]{2,4}$/;

//create a new schema for HospitalEmployee
const HospitalEmployeeSchema = new Schema({
    firstName: {
        type: String,
        trim: true,
        required: true,
        validate: {
            validator: (value) => value.length > 0,
            message: "Cannot be empty, firstname is required"
        }
    },
    lastName: {
        type: String,
        trim: true,
        required: true,
        validate: {
            validator: (value) => value.length > 0,
            message: "Cannot be empty, lastname is required"
        }
    },
    birthDate: {
        type: Date,
        default: '1981-03-21',//TODO: REGEX it 
        required: false
    },
    gender: {
        type: String,
        enum: genders,
        trim: true,
        required: true 
    },
    email: { //must be mandatory as we perform an existing user check
        type: String,
        required: true,
        trim: true,
        unique: true,
        lowercase: true,
        validate: {  //lowercase all options because we want Angela.J@gmail.com == angela.j@gmail.com
            validator: (value) => {
                const lowercaseEmail = value.toLowerCase();
                return goodEmail.test(lowercaseEmail);
            },
            message: 'Invalid email format, Enter it in <name>@<domain>.<tld>'
        }
    },
    address: {
        type: String,
        required: false //TODO: convert to an embedded doc
    },
    phone: {
        type: String,
        required: true,
        trim:true,      //TODO: Add support for international numbers too?
        validate: {
            validator: (value) => goodPhone.test(value),
            message: 'Invalid Phone # format, Enter in +971XXXXX format'
        }
    },
    username: {
        type: String,
        trim: true,
        unique: true,
        required: true
    },
    password: {
        type: String,   
        trim: true,
        required: true
    },
    joiningDate: {
        type: Date,
        default: Date.now(), //TODO: accept user input and regex it
        required: false        
    },
    role: {
        type: String,
        trim: true,         //TODO: Shall we make it less strict i.e: Doctor, doctor, DOCTOR, DoCToR?
        enum: roles,
        required: true
    }
});
//export the module
const HospitalEmployeeModel = mongoose.model('HospitalEmployees', HospitalEmployeeSchema);
module.exports = HospitalEmployeeModel;