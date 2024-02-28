# Patient Registration Service

## Steps to launch
* Clone this repository: `git clone https://github.com/F21AO2024/F21AOGroup2.git`
* Enter the directory for `services/gateway` be in the same level as  `package.json`
* Install the required dependencies `npm install`
* Run it in development mode as `npm run dev`
* Run it in production mode as `npm run start`
* The gateway service will be running on port 3000

### Steps to test Patient Reg Service
* Enter the directory for `services/patient-registration-service`
* Install the required dependencies `npm install`
* Run it in development mode as `npm run dev`
* Run it in production mode as `npm run start`
* The patient service runs on port 3002

### Sprint 3 Updates:
* Made bug fixes of the logic of proxying properly and rbac for this microservice.
* The JIRA Task issues this relates to and completed: F21AO-46, F21AO-7, F21AO-6, F21AO-64, F21AO-86
* This microservice uses a separate database for testing called: `hpis-db`
* In order to check for an existing employee and then check it's role in the db if matching with what is in `patientRoutes.js` I used API call to the HopsitalEmployee (which was originally sitting in the gateway microservice) via axios. The above 2 points were chosen so as to be close to microservices approach as possible by being low coupling and high cohesion.
* Earlier I also placed the authentication and role checks in the gateway microservice and overall my logic was not quite right because I was defining the specific API endpoint in the `gateway/routes/routes.js` which is not right because that part is for the proxying not evaluating the suffix of the URL at that stage, because also each action had particular roles that could access these pages. I felt to abide by the looser coupling and less reliance or load on the gateway I implemented `authRole.js` and `checkRole.js` as middlewares here specifically in the microservice. When a request to register patients is made with the user's token, it forwards this to microservice and here is performs the decryption and verification. Although a minor downside I noticed was extra code which is sort of duplicated from the API gateway.
