const { Strategy, ExtractJwt } = require("passport-jwt");
const secret = require("../config/app.config").SECRET;
const User = require("../models/index").User;
const { isEmpty } = require("lodash");
const opts = {};
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
opts.secretOrKey = secret;

module.exports = passport => {
  passport.use(
    new Strategy(opts, (jwt_payload, done) => {
      User.findOne({
        where: { id: jwt_payload.id },
        attributes: ["id", "email", "mobile", "user_type"]
      }).then(user => {
        if (!user) return done(null, false);
        return done(null, jwt_payload);
      });
    })
  );
};
