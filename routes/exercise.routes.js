const express = require("express");
const exerciseRouter = express.Router();
const ExerciseController = require("../controllers/exercise.controller");

exerciseRouter
  .route("/exercises")
  .post((req, res) => new ExerciseController().createExerciseForUser(req, res));

exerciseRouter
  .route("/logs")
  .get((req, res) => new ExerciseController().getUsersExercises(req, res));

module.exports = exerciseRouter;
