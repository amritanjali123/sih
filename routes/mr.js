const router = require("express").Router();
const passport = require("passport");
const { Op } = require("sequelize");

const { validatePOST } = require("../validator/JoiValidator");
const DB = require("../models/index");

router.get("/test", (req, res) => {
  res.send("Working MR route fine");
});

router.post(
  "/request",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    if (!req.body.doc_id)
      return res.status(400).json({ error: "Doctor Id not found" });
    const doctor = await DB.User.findOne({
      where: { id: req.body.doc_id, user_type: "DOC" }
    });
    if (!doctor) return res.status(400).json({ error: "Doctor not found" });
    DB.DocMrReq.create({ MrId: req.user.id, DocId: req.body.doc_id })
      .then(data => res.json({ message: "Request sent successful" }))
      .catch(err =>
        //res.status(400).json({ [err.errors[0].path]: err.errors[0].message })
        res.json({ error: "Already request sent" })
      );
  }
);

router.get(
  "/connected",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    DB.DocMrReq.findAll({
      where: { MrId: req.user.id, approve: true, decline: false },
      include: [
        {
          model: DB.User,
          as: "Doctor",
          attributes: ["id", "name", "email", "mobile"]
        }
      ]
    }).then(doc => {
      res.json(doc);
    });
  }
);

router.get(
  "/feed",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    DB.User.findOne({
      where: { id: req.user.id },
      include: [{ model: DB.Post, as: "MRPost" }]
    }).then(doc => res.json(doc));
  }
);

router.get("/search/:name", async (req, res) => {
  const output = {};
  output.user = await DB.User.findAll({
    where: { name: { [Op.like]: `%${req.params.name}%` } },
    where: {
      [Op.or]: [
        { name: { [Op.like]: `%${req.params.name}%` } },
        { email: { [Op.like]: `%${req.params.name}%` } },
        { mobile: { [Op.like]: `%${req.params.name}%` } }
      ]
    }
  });

  output.post = await DB.Post.findAll({
    where: {
      [Op.or]: [
        { name: { [Op.like]: `%${req.params.name}%` } },
        { description: { [Op.like]: `%${req.params.name}%` } },
        { therapeutic_indication: { [Op.like]: `%${req.params.name}%` } },
        { side_effects: { [Op.like]: `%${req.params.name}%` } }
      ]
    }
  });
  res.json({ output: output });
});

//for checking company type user
function checkTypes(req, res, next) {
  if (req.user.user_type == "MR") next();
  else res.status(401).json({ error: "Not Authorized" });
}

module.exports = router;
