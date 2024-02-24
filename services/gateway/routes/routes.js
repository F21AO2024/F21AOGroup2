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
  {
    url: "/api/v1/patient",
    auth: false,
    proxy: {
      target: "http://127.0.0.1:3002",
      changeOrigin: true,
      // pathRewrite: {
      //   "^/patient": "",
      // },
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