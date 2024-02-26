/*
When a request is made to http://localhost:3000/patient/register, the API gateway
will check these ROUTES and find any /patient if it does then it will proxy the request to the
http://localhost:3002/patient/register 
*/
export const ROUTES = [
  {
    url: "/api/v1/ward",
    auth: true,
    proxy: {
      target: "http://127.0.0.1:3001",
      changeOrigin: true,
      // pathRewrite: {
      //   "^/wards": "",
      // },
    },
  },
  //{//initial oatient registration - DONE, WORKING
  //  url: "/api/v1/patient/register",
  //  method: "post",
  //  auth: true,
  //  role: ['Clerk'],
  //  proxy: {
  //    target: "http://127.0.0.1:3002",
  //    changeOrigin: true,
  //  },//TODO: add v2 later
  //},
  {
    url: "/api/v1/patient",
    auth: true,
    // role: ['Doctor', 'Nurse', 'Paramedic'],
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