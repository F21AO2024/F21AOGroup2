const express = require('express');
const router = express.Router();
const patientController = require('../controllers/patientController');
const checkRole = require('../middleware/checkRole');

//F21AO-64, F21AO-6, F21AO-7, F21AO-46
router.post('/register', checkRole(['Clerk']), patientController.register); //register a new patient
//use the restful approach for the routes of getting details
//putting the url id in the GET request is more aligned with the RESTful approach
router.get('/:id', checkRole(['Doctor', 'Paramedic', 'Nurse']), patientController.details);    //get a patient and see his details by id
router.put('/:id', checkRole(['Doctor', 'Paramedic', 'Nurse']), patientController.updatePatient); //update a patient details by id

module.exports = router;