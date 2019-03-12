const router = require("express").Router();
const passport = require("passport");
const { isEmpty } = require("lodash");
const jwt = require("jsonwebtoken");
const DB = require("../models");

router.get(
  "/request",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    switch (req.user.user_type) {
      case "DOC":
        DB.DocMrReq.findAll({
          where: { DocId: req.user.id, approve: false, decline: false },
          include: [
            {
              model: DB.User,
              as: "MR",
              attributes: ["id", "name", "email", "mobile"],
              include: [
                {
                  model: DB.MRDashboard,
                  attributes: ["id"],
                  include: [{ model: DB.User, as: "MR", attributes: ["name"] }]
                }
              ]
            }
          ]
        }).then(doc => {
          res.json(doc);
        });
        break;
      case "MR":
        DB.DocMrReq.findAll({
          where: { MrId: req.user.id, approve: false, decline: false },
          include: [
            {
              model: DB.User,
              as: "Doctor",
              attributes: ["id", "name", "email", "mobile"]
            }
          ]
        }).then(doc => {
          const MR = {
            MrId: doc.MrId,
            name: doc.Doctor
          };
          res.json(doc[0]);
        });
        break;
    }
  }
);

router.post(
  "/comment",
  passport.authenticate("jwt", { session: false }),
  checkTypes,
  (req, res) => {
    if (!req.body.post_id)
      return res.status(400).json({ error: "PostId not found" });
    if (!req.body.comment)
      return res.status(400).json({ error: "Comment is required" });
    DB.PostComment.create({
      PostId: req.body.post_id,
      comment: req.body.comment,
      UserId: req.user.id
    })
      .then(doc => res.json({ message: "Comment submitted successfully" }))
      .catch(err => res.json(err));
  }
);

router.post(
  "/approve",
  passport.authenticate("jwt", { session: false }),
  checkTypes,
  (req, res) => {
    if (!req.body.mr_id)
      return res.status(400).json({ error: "MRId not found" });
    DB.DocMrReq.findOne({
      where: {
        MrId: req.body.mr_id,
        DocId: req.user.id,
        approve: false,
        decline: false
      }
    }).then(request => {
      if (isEmpty(request))
        return res.status(400).json({ error: "Data not found" });
      request.approve = true;
      request.save();
      res.json({ message: "Request Accepted successful" });
    });
  }
);

router.post(
  "/decline",
  passport.authenticate("jwt", { session: false }),
  checkTypes,
  (req, res) => {
    if (!req.body.mr_id)
      return res.status(400).json({ error: "MRId not found" });
    DB.DocMrReq.findOne({
      where: {
        MrId: req.body.mr_id,
        DocId: req.user.id,
        approve: false,
        decline: false
      }
    }).then(request => {
      if (isEmpty(request))
        return res.status(400).json({ error: "Data not found" });
      request.decline = true;
      request.save();
      res.json({ message: "Request Decline successful" });
    });
  }
);

router.post(
  "/upvote",
  passport.authenticate("jwt", { session: false }),
  checkTypes,
  async (req, res) => {
    if (!req.body.post_id)
      return res.status(400).json({ error: "No post id found" });
    const post = await DB.Post.findOne({ where: { id: req.body.post_id } });
    if (!post) return res.status(400).json({ error: "Post not found" });
    const downVote = await DB.DownVote.findOne({
      where: { PostId: req.body.post_id, UserId: req.user.id }
    });

    DB.UpVote.create({ PostId: req.body.post_id, UserId: req.user.id })
      .then(doc => {
        if (downVote) {
          post.decrement("downVote", { by: 1 });
          downVote.destroy();
        }
        post.increment("upVote", { by: 1 });
        res.json({ message: "Upvoted" });
      })
      .catch(err => {
        DB.UpVote.destroy({
          where: { UserId: req.user.id, PostId: req.body.post_id }
        }).then(doc => {
          post.decrement("upVote", { by: 1 });
          res.json({ message: "Upvote cancelled" });
        });
      });
  }
);

router.post(
  "/downvote",
  passport.authenticate("jwt", { session: false }),
  checkTypes,
  async (req, res) => {
    if (!req.body.post_id)
      return res.status(400).json({ error: "No post id found" });
    const post = await DB.Post.findOne({ where: { id: req.body.post_id } });
    if (!post) return res.status(400).json({ error: "Post not found" });

    const upVote = await DB.UpVote.findOne({
      where: { PostId: req.body.post_id, UserId: req.user.id }
    });

    DB.DownVote.create({ PostId: req.body.post_id, UserId: req.user.id })
      .then(doc => {
        if (upVote) {
          upVote.destroy();
          post.decrement("upVote", { by: 1 });
        }
        post.increment("downVote", { by: 1 });
        res.json({ message: "Downvoted" });
      })
      .catch(err => {
        DB.DownVote.destroy({
          where: { UserId: req.user.id, PostId: req.body.post_id }
        }).then(doc => {
          post.decrement("downVote", { by: 1 });
          res.json({ message: "DownVote cancelled" });
        });
      });
  }
);

router.post(
  "/decline",
  passport.authenticate("jwt", { session: false }),
  checkTypes,
  (req, res) => {
    if (!req.body.mr_id)
      return res.status(400).json({ error: "MRId not found" });
    DB.DocMrReq.findOne({
      where: { MrId: req.body.mr_id, approve: false, decline: false }
    }).then(request => {
      if (isEmpty(request))
        return res.status(400).json({ error: "Data not found" });
      request.decline = true;
      request.save();
      res.json({ message: "Request Decline successful" });
    });
  }
);

router.get("/post/:post_type", verifyAuth, (req, res) => {
  DB.DocMrReq.findOne({
    where: { DocId: req.user.id /*approve: true, decline: false*/ },
    attributes: ["id"],
    include: [
      {
        attributes: ["id"],
        model: DB.User,
        as: "MR",
        include: [
          {
            model: DB.Post,
            as: "MRPost",
            through: DB.MrPost,
            include: [
              {
                model: DB.User,
                as: "CompPost",
                attributes: ["name"],
                required: false
              },
              {
                model: DB.PostComment
              },
              {
                model: DB.UpVote,
                attributes: ["id"],
                where: { UserId: req.user.id },
                required: false
              },
              {
                model: DB.DownVote,
                attributes: ["id"],
                where: { UserId: req.user.id },
                required: false
              }
            ]
          }
        ]
      }
    ]
  }).then(post => {
    if (!post) return res.status(400).json({ error: "Nothing found" });
    post = post.MR.MRPost;
    res.json(post);
  });
});

async function verifyAuth(req, res, next) {
  switch (req.params.post_type) {
    case "NEWEST":
      res.json(
        await DB.Post.findAll({
          order: [["updatedAt", "DESC"]],
          include: [
            { model: DB.User, as: "CompPost", attributes: ["name"] },
            { model: DB.PostComment }
          ]
        })
      );
      break;
    case "POPULARITY":
      res.json(
        await DB.Post.findAll({
          order: [["upVote", "DESC"]],
          include: [
            { model: DB.User, as: "CompPost", attributes: ["name"] },
            { model: DB.PostComment }
          ]
        })
      );
      break;
    case "CONNECTED":
      const header = req.headers.authorization;
      if (!header) return res.status(400).json({ error: "Token not found" });
      const token = header.split(" ")[1];
      const data = jwt.decode(token);
      user = await DB.User.findOne({
        where: { id: data.id, user_type: "DOC" }
      });
      if (user) {
        req.user = user;
        return next();
      } else
        res.json(await DB.Post.findAll({ order: [["updatedAt", "DESC"]] }));
      break;
  }
}

router.post("/question", (req, res) => {
  if (!req.body.question)
    return res.status(400).json({ error: "Quesiton Not found" });
  DB.PublicPost.create({ Question: req.body.question }).then(doc => {
    res.json({ message: "quesiton Added successfully" });
  });
});

router.get("/question", (req, res) => {
  DB.PublicPost.findAll({ include: [DB.Answer] }).then(doc =>
    res.json(doc)
  );
});

router.post(
  "/answer",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    if (!req.body.question_id)
      return res.status(400).json({ error: "question_id not found" });
    if (!req.body.answer)
      return res.status(400).json({ error: "Answer not found" });
    DB.Answer.create({
      UserId: req.user.id,
      Answer: req.body.answer,
      PublicPostId: req.body.question_id
    })
      .then(doc => res.json({ message: "Answer submitted successfully" }))
      .catch(error => res.status(400).json(error));
  }
);

router.get(
  "/connectedMR",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    DB.DocMrReq.findAll({ where: { DocId: req.user.id } }).then(doc =>
      res.json(doc)
    );
  }
);

async function sendGenPost() {
  return await DB.Post.findAll({});
}
//for checking company type user
function checkTypes(req, res, next) {
  if (req.user.user_type == "DOC") next();
  else res.status(401).json({ error: "Not Authorized" });
}

module.exports = router;
