/*
When a request is made to http://localhost:3000/patient/register, the API gateway
will check these ROUTES and find any /patient if it does then it will proxy the request to the
http://localhost:3002/patient/register 
*/
export const ROUTES = [
  {
    url: "/api/v1/warddmissions",
    auth: true,
    proxy: {
      target: "http://127.0.0.1:3001",
      changeOrigin: true,
    },
  },
  {
    url: "/api/v1/patient",
    auth: true,
    proxy: {
      target: "http://127.0.0.1:3002",
      changeOrigin: true,
    },
  },
  {
    url: "/api/v1/labtreatment",
    auth: true,
    proxy: {
      target: "http://127.0.0.1:3003",
      changeOrigin: true,
    },
  },
];

/*
  F21AO-86
  You are right. doing something like /api/v1/patient/register here 
  is not microservices architecture. Each microserice must define its own routes
  and the API gateway will just proxy the request to the correct microservice.
  It will forward all requests to /api/v1/patient/ to the patient-registration-service 
  and in the routes of that microserice it will further check the suffix of the URL 
  {
    url: "/api/v1/patient/register",
    auth: true,
    role: 'Clerk',
    proxy: {
      target: "http://127.0.0.1:3002",
      changeOrigin: true,
  },
*/
