export const ROUTES = [
  {
    url: "/ward",
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
    url: "/patient",
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
    url: "/labtreatment",
    auth: false,
    proxy: {
      target: "http://127.0.0.1:3003",
      changeOrigin: true,

    },
  },
];