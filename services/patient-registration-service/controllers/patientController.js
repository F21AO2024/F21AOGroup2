const PatientModel = require('../models/patientModel');
//F21AO-64, 
//requirement 2 and requirement 5
//Only the registration clerk can register a patient into the system at different service points in the hospital. At this point only basic personal details and known diseases or complaints are entered in the system.
// Patients can be registered at any of the service points above in point 4. by the registration clerk.
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
//since this is used more than once, make a method to avoid duplication
// F21AO-65
async function findPatientById(id) {
    const patient = await PatientModel.findById(id);
    if (!patient) {
        return res.status(404).send({ message: 'Patient not found, does not exist', success: false });
    }
    return patient;
};


//F21AO-6
// F21AO-65
exports.details = async (req, res) => {
    try {
        console.log(req.params)
        //use  _id for mongoose as it is an ObjectId() not UUID like in prisma
        // const patient = await PatientModel.findOne({_id: req.params.id});
        // console.log(patient);
        // if (!patient) {
        //     return res.status(404).send({ message: 'Patient not found', success: false });
        // }
        const patient = await findPatientById(req.params.id);
        console.log(patient);
        res.status(200).send(patient);
    } catch (error) {
        res.status(500).send({ message: `A server error occurred when fetching this patient ${error.message}`, success: false});
    }
};

//Update the patient details
//F21AO-73 
exports.updatePatient = async (req, res) => {
    try {
        let patient = await findPatientById(req.params.id);
        patient.type = req.body.type;
        patient.department = req.body.department;

        //requirement 3
        //Doctors, nurses, and paramedics can retrieve patient’s details using a unique patient identifier and populate additional diseases and referral details at OPD, A&E and other service points.
        if (req.body.knownDiseases) {
            patient.knownDiseases = [...new Set(patient.knownDiseases.concat(req.body.knownDiseases))];
        }
        if (req.body.currentComplaints) {
            patient.currentComplaints = [...new Set(patient.currentComplaints.concat(req.body.currentComplaints))];
        }
        if (req.body.services) {
            patient.services = [...new Set(patient.services.concat(req.body.services))];
        }
        //save the details
        const updatedPatient = await patient.save();
        console.log(updatedPatient);
        res.status(200).send(updatedPatient); //TODO: add a message here

    } catch (error) {
        console.error(error);
        res.status(500).send({ message: `A server error occurred when updating this patient ${error.message}`, success: false});
    }
};

