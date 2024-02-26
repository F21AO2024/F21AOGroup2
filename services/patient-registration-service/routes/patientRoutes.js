const express = require('express');
const router = express.Router();
const patientController = require('../controllers/patientController');

router.post('/register', patientController.register); //register a new patient
router.get('/:id', patientController.details);    //get a patient and see his details by id
router.put('/:id', patientController.updatePatient); //update a patient details by id

module.exports = router;