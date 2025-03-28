const express = require("express");
const userRouter = express.Router();
const UserController = require("../controllers/user.controller");
const exerciseRouter = require("../routes/exercise.routes");

userRouter
  .route("/")
  .post((req, res) => new UserController().createUser(req, res));

userRouter
  .route("/")
  .get((req, res) => new UserController().getAllUsers(req, res));

userRouter.use(
  "/:id",
  (req, _, next) => {
    req._id = req.params._id;
    next();
  },
  exerciseRouter
);

module.exports = userRouter;
