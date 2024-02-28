const PatientModel = require('../models/patientModel');
//F21AO-64
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
//F21AO-6
exports.details = async (req, res) => {
    try {
        console.log(req.params)
        //use  _id for mongoose as it is an ObjectId() not UUID like in prisma
        const patient = await PatientModel.findOne({_id: req.params.id});
        console.log(patient);
        if (!patient) {
            return res.status(404).send({ message: 'Patient not found', success: false });
        }
        res.status(200).send(patient);
    } catch (error) {
        res.status(500).send({ message: `A server error occurred when fetching this patient ${error.message}`, success: false});
    }
};

exports.updatePatient = async (req, res) => {

};
//TODO: add to GitHub and JIRA
//TODO: whitelist all IPs (0.0.0.0) to allow access from anywhere

