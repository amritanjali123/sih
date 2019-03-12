const router = require("express").Router();
const { Op } = require("sequelize");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const passport = require("passport");

const DB = require("../models/index");
const secret = require("../config/app.config").SECRET;
const {
  validateUser,
  validateLogin,
  validateDOC,
  validateCOMP,
  validateMR
} = require("../validator/JoiValidator");
const { SaveFile, SaveImage } = require("../utils/index");

//@route    GET /api/user/test
//@desc     User route test
//@access   Public
router.get("/test", (req, res) => {
  res.send("This is test for User route");
});

//@route    POST /api/user/register
//@desc     User route for registration
//@access   Public
router.post("/register", (req, res) => {
  const { userErrors, userData } = validateUser(req.body);
  if (userErrors) return res.status(400).json(userErrors);
  switch (userData.user_type) {
    case "DOC":
      const { docErrors, docData } = validateDOC(req.body);
      if (docErrors) return res.status(400).json(docErrors);
      createUser(userData)
        .then(userId => {
          docData.UserId = userId;
          // if (req.files && req.files.profile) {
          //   const { imageError, image_name } = SaveImage(req.files.profile);
          //   if (imageError) return res.status(400).json(imageError);
          //   docData.profile = image_name;
          // }
          DB.DOCDashboard.create(docData)
            .then(dash => {
              res.json({ message: "Registration successful" });
            })
            .catch(err =>
              res
                .status(400)
                .json({ [err.errors[0].path]: err.errors[0].message })
            );
        })
        .catch(err => res.status(400).send(err));
      break;
    case "COMP":
      const { compErrors, compData } = validateCOMP(req.body);
      if (compErrors) return res.status(400).json(compErrors);
      createUser(userData)
        .then(userId => {
          compData.UserId = userId;
          // if (req.files && req.files.profile) {
          //   const { imageError, image_name } = SaveImage(req.files.profile);
          //   if (imageError) return res.status(400).json(imageError);
          //   docData.profile = image_name;
          // }
          DB.CompDashboard.create(compData)
            .then(dash => {
              res.json({ message: "Registration successful" });
            })
            .catch(err =>
              res
                .status(400)
                .json({ [err.errors[0].path]: err.errors[0].message })
            );
        })
        .catch(err => res.status(400).send(err));
      break;
  }
});
//function to create user before creation of their respective dashboard
const createUser = userData => {
  return new Promise((resolve, reject) => {
    DB.User.create(userData)
      .then(user => {
        resolve(user.id);
      })
      .catch(err => reject({ [err.errors[0].path]: err.errors[0].message }));
  });
};

//@route    POST /api/user/test
//@desc     User route test
//@access   Public
router.post("/login", (req, res) => {
  const { loginErrors, loginData } = validateLogin(req.body);
  if (loginErrors) return res.status(400).json(loginErrors);
  DB.User.findOne({
    where: {
      [Op.or]: [{ email: loginData.username }, { mobile: loginData.username }]
    }
  }).then(user => {
    if (!user) return res.status(400).json({ login: "User not found" });
    const valid = bcrypt.compareSync(loginData.password, user.password);
    if (!valid) return res.status(400).json({ login: "Login failed" });
    const payload = {
      id: user.id,
      email: user.email,
      time: Date.now,
      user_type: user.user_type
    };
    let token = jwt.sign(payload, secret, {
      issuer: "unknown",
      expiresIn: "24h"
    });
    res.json({ success: "Login successful", token: `bearer ${token}` });
  });
});
//@route    GET /api/user/dashboard
//@desc     User route to get their dashboard
//@access   Protected
router.get(
  "/dashboard",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    // switch case to return dashboard for respective auth user
    switch (req.user.user_type) {
      case "DOC":
        DB.User.findOne({
          where: { id: req.user.id, user_type: "DOC" },
          attributes: ["name", "email", "mobile", "profile", "cover"],
          include: [
            {
              model: DB.DOCDashboard,
              attributes: [
                "specialization",
                "qualification",
                "current_location"
              ]
            }
          ]
        }).then(doc => res.json(doc));
        break;
      case "MR":
        DB.User.findOne({
          where: { id: req.user.id, user_type: "MR" },
          include: [{ model: DB.MRDashboard }]
        }).then(doc => res.json(doc));
        break;
      case "COMP":
        DB.User.findOne({
          where: { id: req.user.id, user_type: "COMP" },
          include: [{ model: DB.CompDashboard }]
        }).then(doc => res.json(doc));
        break;
    }
  }
);

router.patch(
  "/image",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    switch (req.body.type) {
      case "profile":
        DB.User.findOne({ where: { id: req.user.id } }).then(user => {
          if (req.files) {
            const { imageError, image_name } = SaveImage(req.files.image);
            user.profile = image_name;
            user.save();
            res.json({ message: "Profile Uploaded successful" });
          } else res.status(400).json({ error: "No image found" });
        });
        break;
      case "cover":
        DB.User.findOne({ where: { id: req.user.id } }).then(user => {
          if (req.files) {
            const { imageError, image_name } = SaveImage(req.files.image);
            user.cover = image_name;
            user.save();
            res.json({ message: "Cover Uploaded successful" });
          } else res.status(400).json({ error: "No image found" });
        });
        break;
    }
  }
);

module.exports = router;
module.exports.createUser = createUser;
