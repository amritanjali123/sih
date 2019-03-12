if (process.env.Node_ENV == "production")
  // export this if environment is production
  module.exports = {
    PORT: process.env.PORT || 80, // port number for application in production
    dbURL: process.env.DB_LINK || "mongodb://localhost:27017/techfest", // database URL
    SECRET: "secretkey" // secret key for JWT
  };
else
  module.exports = {
    // export this if environment is in development or testing
    PORT: process.env.PORT || 3000,
    dbURL: process.env.DB_LINK || "mongodb://localhost:27017/techfest",
    SECRET: "secretkey" // secret key for JWT
  };
