const router = require("express").Router();
const passport = require("passport");

const {
  validateMR,
  validateUser,
  validatePOST
} = require("../validator/JoiValidator");
const { createUser } = require("./user");
const { SaveImage } = require("../utils/index");
const DB = require("../models/index");

router.get("/test", (req, res) => {
  res.send("Working fine");
});

router.post(
  "/create/mr",
  passport.authenticate("jwt", { session: false }),
  checkTypes,
  async (req, res) => {
    const { mrErrors, mrData } = validateMR(req.body);
    if (mrErrors) return res.status(400).json(mrErrors);
    req.body.user_type = "MR";
    const { userErrors, userData } = validateUser(req.body);
    if (userErrors) return res.status(400).json(userErrors);
    createUser(userData)
      .then(async userId => {
        mrData.UserId = userId;
        mrData.CompId = req.user.id;
        DB.MRDashboard.create(mrData).then(dash => {
          res.json({ message: "MR added successful" });
        });
      })
      .catch(err => res.status(400).send(err));
  }
);

router.post(
  "/medicine",
  passport.authenticate("jwt", { session: false }),
  checkTypes,
  async (req, res) => {
    const { postErrors, postData } = validatePOST(req.body);
    if (postErrors) return res.status(400).json(postErrors);
    postData.CompId = req.user.id;
    DB.Post.create(postData)
      .then(post => {
        post.addMrPosts(postData.MRS);
        res.json({ message: "Medicine Added successfully" });
        if (req.files) handleImage(req, post.id);
      })
      .catch(err => {
        console.log(err);
        res.status(400).json({ [err.errors[0].path]: err.errors[0].message });
      });
  }
);

function handleImage(req, id) {
  const images = [];
  for (image in data) {
    const { imageError, image_name } = SaveImage(req.files[image]);
    images.push({ ImageName: image_name, PostId: id });
    DB.Image.bulkCreate(images);
  }
}

router.get(
  "/mr",
  passport.authenticate("jwt", { session: false }),
  checkTypes,
  (req, res) => {
    DB.User.findOne({
      where: { id: req.user.id },
      attributes: [],
      include: [
        {
          model: DB.MRDashboard,
          as: "MR",
          include: [
            { model: DB.User, attributes: ["name", "email", "mobile", "id"] }
          ],
          attributes: ["emp_id"]
        }
      ]
    }).then(mrs => res.json(mrs));
  }
);

router.get(
  "/doctor",
  passport.authenticate("jwt", { session: false }),
  checkTypes,
  (req, res) => {
    DB.User.findOne({
      where: { id: req.user.id },
      attributes: ["id"],
      include: [
        {
          model: DB.DocMrReq,
          attributes: ["id"],
          include: [
            {
              model: DB.User,
              as: "Doctor",
              attributes: ["name", "email", "mobile"]
            },
            {
              model: DB.User,
              as: "MR",
              attributes: ["id", "name", "email", "mobile"]
            }
          ]
        }
      ]
    }).then(user => res.json(user));
  }
);

//for checking company type user
function checkTypes(req, res, next) {
  if (req.user.user_type == "COMP") next();
  else res.status(401).json({ error: "Not Authorized" });
}

module.exports = router;
