# Mocha + Chai testing

## Steps to replicate
0. Ensure to have the microservices running prior to below
1. uncomment URL in the `gateway/prisma/schema.prisma` to `url      = env("TEST_DB_PATIENT")`
2. Enter the `patient-reg-tests`
3. Install dependencies with `npm install --save-dev mocha chai chai-http mochawesome  jsonwebtoken`
4. Run with `npm run test`