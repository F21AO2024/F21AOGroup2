# F21AO DevOps Group 2, CW1 Dev Phase Submission (01-March-2024):
Welcome, this is the main entrypoint of the repository.

## Team Members
1. Ekaterina Larchenkova, H00453948
2. Deepesh Khamat, H00448733   
3. Emmanuel Ejakpomewhe, H00462741 
4. Tauhid Junaid, H00464629 

## Microservices Implemented
Our methodlogy was to first fulfill the 10 requirements listed in the PDF and then logically design and decide which requirements goes into which microservice.

We implemented 4 modules/microservices in total, and they are:
* Authentication, see it in `gateway`
* Initial Patient Registration `services/patient-registration-service`
* Ward Admissions `services/ward-admissions-service`
* Lab treatments `services/lab-treatment-service`

### API Gateway
1. API Gateway: single entry point of the HPIS system
2. Authentication: returns an encoded JWT token for each registered user
3. Proxying: forwards the requests to the right microservice based on API endpoint
5. User Management: we implemented the controller to handle:
    * Registering a hospital employee
    * Logging in as a hopsital employee
    * Changing the password as a hospital employee

### Patient Registration Microservice
1. Registering a patient
2. Getting the patient's details via his ID
3. Updating a patient's details via his ID
4. For 1-3 there is access and management control implemented in the middleware of this service which first authenticates the user's token again, then checks the user's role if legitimate. See it in `services/patient-registration-service/middleware/`.

### Ward Admissions Microservice
1. Creating a new ward
2. Retrieving all the wards
3. Getting a ward's details by it's ID
4. Delete a ward by it's ID
5. Assign a doctor to the ward
6. Refer a patient to the ward
7. Discharge a patient

### Lab Treatment Microservice
1. Create record of a patient treatment
2. Get details of a treatment
3. Record a diagnosis as a Doctor
4. Get Diagnosis details
5. Record daily treatment as a doctor or nurse
6. Get the daily treatment
7. Sign off or discharge the treatment
8. Record lab results
9. Get the lab results

## How to run?
We have developed, implemented and tested our HPIS system on the localhost of our machines. To try it yourself follow the below steps:

1. Clone this repo: `https://github.com/F21AO2024/F21AOGroup2.git`
2. 


