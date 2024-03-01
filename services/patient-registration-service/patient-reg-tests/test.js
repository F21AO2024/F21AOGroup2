const chai = require('chai');
const chaiHttp = require('chai-http'); //-> this was giving me an error about the require() not supported, downgrade to 4.X.X
const expect = chai.expect;
const jwt = require('jsonwebtoken');

chai.use(chaiHttp);

//API URLs
const patient_reg_url = 'http://localhost:3000/api/v1/patient/register';
const patient_get_url = 'http://localhost:3000/api/v1/patient/:id';
const patient_update_url = 'http://localhost:3000/api/v1/patient/:id';


//randomly return gender
function randomGender() {
    const genders = ['Female', 'Male'];
    const random_num = Math.floor(Math.random() * 2);
    return genders[random_num];
}

//return random entryPoint 
function returnEntryPoint() {
    const entryPoints = ['OPD', 'A&E'];
    const random_num = Math.floor(Math.random() * 2);
    return entryPoints[random_num];
}

//return random department
function returnDepartment() {
    const departments = ['A&E','OPD','Medicine', 'Surgery', 'Orthopedics', 'Pediatrics', 'ENT', 'Ophthalmology', 'Gynecology', 'Dermatology', 'Oncology'];
    const random_num = Math.floor(Math.random() * 2);
    return departments[random_num];

}

//return random service
function returnService() {
    const services = ['Radiology', 'Pathology', 'Physiotherapy', 'Blood Bank', 'Operation Theatres'];
    const random_num = Math.floor(Math.random() * 2);
    return services[random_num];
}
function generateLetters(length) {
    let rand_chars = '';
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
    for (let i = 0; i < length; i++) {
        rand_chars += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return rand_chars;
}
//function to generate some data for patient registration
function generatePatientData() {
    const timestamp = Date.now().toString(36);
    console.log(generateLetters(3));
    return {
        firstName: `testPatient${timestamp}`,
        email: 'testPatient' + generateLetters(3) + '@gmail.com',
        gender: randomGender(),
        lastName: 'test_patient_' + timestamp.toString(),
        phone: "+971501234567",
        currentComplaints: ["Vomiting", "Nausea", "Stomach Pains"],
        knownDiseases: ["Arthritis"],
        department: returnDepartment(),
        services: returnService(),
        entryPoint: returnEntryPoint(),
    };
}

function getEmployeeTemplate(type) {
    if (type === 'Clerk') {
        return {
            "email":"Marie.sak@gmail.com",
            "username": "mak21",
            "gender": "Female",
            "password": "2ewq1@20",
            "firstName": "Marie",
            "lastName": "Sak",
            "role":"Clerk",
            "phone": "+971501234567"
        };
    } else if (type === 'Nurse') {
        return {
            "email":"janet.clark@gmail.com",
            "username": "janetC",
            "gender": "Female",
            "password": "cat@20",
            "firstName": "Janet",
            "lastName": "Clark",
            "role":"Nurse",
            "phone": "+971501234567"
        };
    }
    else if (type === 'Doctor') {
        return {
            "email":"ahmed.dej@gmail.com",
            "username": "ahmedD",
            "gender": "Male",
            "password": "2ewq1@20",
            "firstName": "Ahmed",
            "lastName": "Dej",
            "role":"Doctor",
            "phone": "+971501234567"
        };
    } 
    else if (type === 'Paramedic') {
        return {
            "email":"bart.dej@gmail.com",
            "username": "bart22",
            "gender": "Male",
            "password": "2ewq1@20",
            "firstName": "Bart",
            "lastName": "Dej",
            "role":"Paramedic",
            "phone": "+971501234567"
        };
    } 
    else {
        throw new Error('Invalid employee type');
    }
}
function registerEmployee(index) {
    const employeeData = getEmployeeTemplate(index);
    return new Promise((resolve, reject) => {
        chai.request('http://localhost:3000/api/v1/auth/register')
            .post('')
            .send(employeeData)
            .end(function(err, res) {
                if (err) {
                    reject(err);
                }
                resolve({...res.body, username: employeeData.username, password: employeeData.password, role: employeeData.role});
            });
    });

}

//login and get token encoded, call api endpoint for logging in
function loginGetToken(username, password) {
    return new Promise((resolve, reject) => {
        chai.request('http://localhost:3000')
            .post('/api/v1/auth/login')
            .send({username: username, password: password})
            .end(function(err, res) {
                if (err) {
                    reject(err);
                }
                console.log('received response', res.body)
                resolve(res.body.token);
            });
    });
}
let clerk_token = '';
let doctor_token = '';
let nurse_token = '';
let paramedic_token = '';

before(async () => {
    //pass type for role
    const clerk = await registerEmployee('Clerk');
    const doctor = await registerEmployee('Doctor');
    const nurse = await registerEmployee('Nurse');
    const paramedic = await registerEmployee('Paramedic');
    clerk_token = await loginGetToken(clerk.username, clerk.password);
    doctor_token = await loginGetToken(doctor.username, doctor.password);
    nurse_token = await loginGetToken(nurse.username, nurse.password);
    paramedic_token = await loginGetToken(paramedic.username, paramedic.password);

    // console.log(employee.username);
    // console.log(employee.password);
    // console.log(employee_token);
    // console.log(employee.role)
});

/* Role checks tests */
describe('Employee Patient Registration API', () => {

    //if role OK, token OK, data OK, return 201
    it('Return 201, patient register success as clerk', (done) => {
            chai.request(patient_reg_url)
                .post('')
                .set('Authorization', clerk_token)
                .send(generatePatientData())
                .end(function(err, res) {
                    expect(err).to.be.null;
                    expect(res).to.have.status(201);
                    expect(res.body).to.be.an('object');
                    done();
                });
    });

    //if role OK, patient already exists with this email, return 409
    it('Return 409, patient already exists', (done) => {
        chai.request(patient_reg_url)
            .post('')
            .set('Authorization', clerk_token)
            .send(generatePatientData())
            .end(function(err, res) {
                expect(err).to.be.null;
                expect(res).to.have.status(409);
                expect(res.body).to.be.an('object');
                done();
            });
    });

    //if role not OK, return 403 because not allowed to access
    it('Return 403, not allowed to access', (done) => {
        chai.request(patient_reg_url)
            .post('')
            .set('Authorization', doctor_token)
            .send(generatePatientData())
            .end(function(err, res) {
                expect(err).to.be.null;
                expect(res).to.have.status(403);
                expect(res.body).to.be.an('object');
                done();
            });
    });

    //if token is invalid/expired/tampered with return 401
    it('Return 401, invalid/expired/tampered token', (done) => {
        chai.request(patient_reg_url)
            .post('')
            .set('Authorization', clerk_token + 'a')
            .send(generatePatientData())
            .end(function(err, res) {
                expect(err).to.be.null;
                expect(res).to.have.status(401);
                expect(res.body).to.be.an('object');
                done();
            });
    });
    //if the user forgot to provide the token, return 401
    it('Return 401, no token provided', (done) => {
        chai.request(patient_reg_url)
            .post('')
            .set('Authorization', ' ')
            .send(generatePatientData())
            .end(function(err, res) {
                expect(err).to.be.null;
                expect(res).to.have.status(401);
                expect(res.body).to.be.an('object');
                done();
            });
    });
    //if some other unknown error occurs, return 500
    //Don't think we need this?
    // it('Return 500, unknown error', (done) => {
    //     chai.request(patient_reg_url)
    //         .post('')
    //         .set('Authorization', employee_token)
    //         .send(generatePatientData())
    //         .end(function(err, res) {
    //             expect(err).to.be.null;
    //             expect(res).to.have.status(500);
    //             expect(res.body).to.be.an('object');
    //             done();
    //         });
    // });
});

