# Module 1 - Authentication & Employee Regsiter/Login

This project uses JWT for token based authentication post logging in. As well as login and regsitration functionalities for HospitalEmployees

## Preparation

- Clone the repository with `https://github.com/F21AO2024/F21AOGroup2.git` and enter the directory `cd F21AOGroup2/`
- Ensure you have `node` installed, test with `node -v && npm -v`
- Ensure you are in same directory level as `package.json` and install dependencies with `npm install`
- Run the node application with `npm start` in production mode
- If you wish to run it in development run with `npm run dev` which will launch it via nodemon

## About the Data Formats When Testing

1. Only UAE phone number codes accepted as `+971<your-10d-number>`
2. Only a format of `<name>@<domain-name>.com` is accepted
3. All input cannot be empty string or empty values
4. First name and Last name must only be of letters `[a-z][A-Z]`
5. The gender can only be `Male` or `Female`
6. A person in this HPIS can only be `doctor`, `nurse`, `clerk`, `paramedic`
