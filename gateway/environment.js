const environments = {
  prod: {
    DATABASE_URL: "mongodb+srv://dboska:kxObVNDBXxEni3xs@f21ao-hpis-dxb-db-clust.jubsnfy.mongodb.net/hpis-db",
  },
  dev: {
    DATABASE_URL: "mongodb+srv://dboska:kxObVNDBXxEni3xs@f21ao-hpis-dxb-db-clust.jubsnfy.mongodb.net/hpis",
  },
};

module.exports = environments[process.env.NODE_ENV || 'dev'];