const PatientModel = require('../models/patientModel');

exports.register = async (req, res) => {
    try {
        const existingPatient = await PatientModel.findOne({ email: req.body.email });
        if (existingPatient) {
            return res.status(409).send({ message: 'Patient with this email already exists', success: false});
        }
        const newPatient = new PatientModel(req.body);
        await newPatient.save();
        res.status(201).send({ message: 'Patient resgitered successfully', success: true });

        //TODO: add some extra validation to check whether the input data is valid
    } catch (error) { 
        console.error(error);
        //500 internal server error
        res.status(500).send({ message: `A server error occurred when registering this patient ${error.message}`, success: false});
    }
};

exports.details = async (req, res) => {
    
};

exports.updatePatient = async (req, res) => {

};

