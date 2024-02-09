const ROUTES = [
  {
    url: "/ward",
    auth: true,
    proxy: {
      target: "http://localhost:3001",
      changeOrigin: true,
      pathRewrite: {
        "^/wards": "",
      },
    },
  },
  {
    url: "/patient",
    auth: false,
    proxy: {
      target: "http://localhost:3002",
      changeOrigin: true,
      pathRewrite: {
        "^/patient": "",
      },
    },
  },
];

module.exports = { ROUTES };
