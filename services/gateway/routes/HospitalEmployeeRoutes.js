//import the controller functions
const express = require('express');
const { loginController, registerController, authController } = require('../controllers/HospitalEmployeeCtrl');
const authMiddleware = require('../middlewares/authMiddleware');

//create the router
const router = express.Router();

//define post routes for /login and /register
//route matching and submit handle to the controllers
router.post('/login', loginController);
router.post('/register', registerController);
router.post('/myDashboard', authMiddleware, authController);

//make the router accessible to server.js
module.exports = router;