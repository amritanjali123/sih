"use strict";
const bodyParser = require("body-parser");
const compression = require("compression");
const helmet = require("helmet");
const passport = require("passport");
const morgan = require("morgan");
const cors = require("cors");
const fileupload = require("express-fileupload");

require("../config/passport.config")(passport);
const routes = require("../routes");

module.exports = app => {
  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({ extended: true }));
  app.use(fileupload());
  app.use(compression());
  app.use(helmet());
  app.use(cors());
  app.use(morgan("dev"));
  app.use(passport.initialize());
  app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header(
      "Access-Control-Allow-Headers",
      "Origin, X-Requested-With, Content-Type, Accept, Authorization"
    );
    if (req.method === "OPTIONS") {
      res.header(
        "Access-Control-Allow-Methods",
        "PUT, POST, PATCH, DELETE, GET"
      );
      return res
        .status(404)
        .json({ method: "Only  PUT, POST, PATCH, DELETE, GET allowed" });
    }
    next();
  });

  app.use("/api", routes.user);
  app.use("/api/company", routes.company);
  app.use("/api/mr", routes.mr);
  app.use("/api/doctor", routes.doctor);
  app.use("/api/chat", routes.chat);
  app.use("/", routes.public);
};
