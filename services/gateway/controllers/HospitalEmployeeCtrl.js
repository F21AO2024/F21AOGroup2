
//working - business logic to handle employee login and resgitrarton

const HospitalEmployeeModel = require('../models/HospitalEmployeeModels');
const bcrypt = require('bcryptjs');     //for encrupting the password
const jwt = require('jsonwebtoken');    //user token

//to resgiter
const registerController = async (req, res) => {    
    try {
        const existingEmployee = await HospitalEmployeeModel.findOne({ email: req.body.email });
        if (existingEmployee) {
            //409 check if already exist, 
            //TODO: combine email + username check for extra debfese
            return res.status(409).send({ message: 'Employee with this email already exists', success: false});
        }
        //for security to hash the password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(req.body.password, salt);
        req.body.password = hashedPassword;
        const newEmployee = new HospitalEmployeeModel(req.body);
        await newEmployee.save();
        //201 for successful employee creation
        res.status(201).send({ message: 'Employee resgitered successfully', success: true });

        //TODO: add some extra validation to check whether the input data is valid
    } catch (error) { 
        console.error(error);
        //500 internal server error
        res.status(500).send({ message: `Register Controller ${error.message}`, success: false});
    }
 };
const loginController = async (req, res) => {
    //TODO:Change to username or accept both username or email for login
    //TODO: Edit the error messages and put right status codes
    try {
        const HospitalEmployee = await HospitalEmployeeModel.findOne({ email: req.body.email });
        if (!HospitalEmployee) { 
            return res.status(200).send({ message: 'Employee DNE', success: false });
        }
        const isMatch = await bcrypt.compare(req.body.password, HospitalEmployee.password);
        if (!isMatch) { 
            return res.status(200).send({ message: 'Either password or email invalid', success: false });
        } //use the ObjectID
        const valid_time = '1d';
        const token = jwt.sign({ id: HospitalEmployee._id }, process.env.JWT_SECRET, {expiresIn:valid_time});
        res.status(200).send({ message: `Login success, you are ${HospitalEmployee.role}`, success: true, token });
    } catch (error) { 
        console.error(error);
        //500 internal server error
        res.status(500).send({ message: `Login Controller ${error.message}`, success: false});
    }
};

//handle employee authentication using JWT Bearer tokens
const authController = async (req, res) => {
    try {
        //BUG: After logging in and authenticate success, entering no id or some nonsense id always gives success this is wrong
        const HospitalEmployee = await HospitalEmployeeModel.findOne({_id: req.body.HospitalEmployeeId });
        if (!HospitalEmployee) {
            return res.status(200).send({message: 'Employee DNE', success: false});
        }
        //TODO: Make it look more pretty or descriptive
        else {//if the token is valid (not expired) and real to that employee, return their details for show
            res.status(200).send({
                success: true, data:
                {
                    firstName: HospitalEmployee.firstName,
                    lastName: HospitalEmployee.lastName,
                    email: HospitalEmployee.email,
                    role: HospitalEmployee.role
                },
            })
        }
        
    } catch (error) {
        console.error(error);
        res.status(500).send({ message: 'Authentication error', success: false, error });
    }
 };

module.exports = {loginController, registerController, authController};