//import mongoose
const mongoose = require('mongoose');

//import the Schema constructor from mongoose
const Schema = mongoose.Schema;

//an enum for genders
const genders = ['Male', 'Female'];
//an enum for types for patients
const patient_type = ['Inpatient', 'Outpatient', 'Emergency'];
const status = ['Active', 'Inactive'];

/*regex */
const goodPhone = /^\+971\d{9}$/;
//TODO: requires thorough testing
//BUG: not accepting emails with letetrs+numbers
//source: https://piyush132000.medium.com/mastering-email-validation-in-javascript-multiple-approaches-ae718546160b
const goodEmail = /^[a-zA-Z0–9._-]+@[a-zA-Z0–9.-]+\.[a-zA-Z]{2,4}$/;

//create a new schema for Patients
//TODO: Added a DB level validation, add the server level validation in /api/v2/patient-registration-service/controllers/patientController.js
//TODO: Use library like Joi for server level validation
const PatientSchema = new Schema({
    firstName: {
        type: String,
        trim: true,
        required: true,
        lowercase: true,
        validate: {
            validator: (value) => value.length > 0,
            message: "Cannot be empty, firstname is required"
        }
    },
    lastName: {
        type: String,
        trim: true,
        required: true,
        lowercase: true,
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
        required: false //TODO: convert to a sub document for better structure
    },
    phone: {
        type: String,
        required: true,
        trim:true,      //TODO: Add support for international numbers
        validate: {
            validator: (value) => goodPhone.test(value),
            message: 'Invalid Phone # format, Enter in +971XXXXX format'
        }
    },
    currentComplaints : {
        type: [String],
        /*
        If we look at requirement 2:
        2. Only the registration clerk can register a patient into the system at different service points in the hospital. At this point only basic personal details and known diseases or complaints are entered in the system.
        */
        required: true
    },
    knownDiseases: {
        type: [String],
        /*
        If we look at requirement 2:
        2. Only the registration clerk can register a patient into the system at different service points in the hospital. At this point only basic personal details and known diseases or complaints are entered in the system.
        */
        required: true
    },
    type: {
        type: String,
        enum: patient_type,
        required: false,
        /*
        If we look at requirement 3
        3. Doctors, nurses, and paramedics can retrieve patient’s details using a unique patient identifier and populate additional diseases and referral details at OPD, A&E and other service points
        
        Deduction: From industry practice a patient is usually classified as an outpatient
        immediately upon registering or queueing, and then that is why we need
        the update patient details from the Doctor, as based on his assessment
        he can change the patient type to inpatient.
        */
        default: 'Outpatient' 
    },
    status: {
        type: String,
        enum: status,
        required: false,
        default: 'Active'
    },
    entryPoint: {
        type: String,
        enum: ['OPD', 'A&E'],
        /*
        If we look at the project outline: 
        - There are three entry routes for patients depending on their health conditions. 
        - Patients needing urgent attention are admitted to the hospital through Accident and Emergency (A&E) Department. 
        - Patients visit the Outdoor Patient Department (OPD) for their routine checkup on a pre-booked appointment or on a first come first serve basis.

        Deduction: The entry point is mandatory, it is how the patient first registers through the clerk
        and service points are not the same as entry points. After the patient is registered as either OPD or A&E
        then the Doctor can get and update the patient details, he can assign him new services, change the department, and admit to wards,
        the entryPoint never changes. But the currentLocation changes.
        */
        required: true
    },
    currentLocation: { //usefult for tracking purposes
        type: String,
        enum: ['OPD', 'A&E', 'Medicine', 'Surgery', 'Orthopedics', 'Pediatrics', 'ENT', 'Ophthalmology', 'Gynecology', 'Dermatology', 'Oncology', 'None'],
        required: false,
        default: function() {//by default his first current location == entrypoint and entrypoint never changes
            return this.entryPoint;
        }
    },
    department: {
        type: String,
        required: true,
        /*
        If we look at requirement 3:
        3. Doctors, nurses, and paramedics can retrieve patient’s details using a unique patient identifier and populate additional diseases and referral details at OPD, A&E and other service points.
        
        Deduction: So, OPD and A&E are considered also as service points, namely they are departments
        */
        enum: ['A&E','OPD','Medicine', 'Surgery', 'Orthopedics', 'Pediatrics', 'ENT', 'Ophthalmology', 'Gynecology', 'Dermatology', 'Oncology', 'None']
    },
    services: [{
        type: String,
        /*
        If we put together several requirements, namely requirements: 2,3,4,5
        2. Only the registration clerk can register a patient into the system at different service points in the hospital. At this point only basic personal details and known diseases or complaints are entered in the system.
        3. Doctors, nurses, and paramedics can retrieve patient’s details using a unique patient identifier and populate additional diseases and referral details at OPD, A&E and other service points.
        4. A doctor can refer patients to various services including Radiology, Pathology, Blood Bank, Physiotherapy, Operation Theatre, ICU, CCU and Wards.
        5. Patients can be registered at any of the service points above in point 4. by the registration clerk.
        
        Deduction: only the patient can register patients, he can register to different service points which include 
        departments (which are linked to wards, but another microservice handles this) and services.
        But services and departments have different activities and if you are assigned to a department,
        it does not mean you cannot go for any service. Not a mutually exclusive event.
        However, although the docs state "service points" and club departments and services together,
        it in the longrun sounds difficult to maintain and may lead to tight coupling not favorable for microservices,
        for the time being they are kept separated as dept and services, rather than a subdocument.
        */
        enum: ['Radiology', 'Pathology', 'Physiotherapy', 'Blood Bank', 'Operation Theatres', 'ICU', 'CCU', 'None']
    }],
});


//export the module
const PatientModel = mongoose.model('Patients', PatientSchema);
module.exports = PatientModel;