const query = require("../constants/query.contants");
const message = require("../constants/message.constants");
const db = require("../database.");

class ExercisesController {
  createExerciseForUser = (req, res) => {
    const userId = req._id;

    const { description, duration, date } = req.body;

    db.get(query.SELECT_EXERCISES_BY_USER_ID, [userId], (err, row) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }

      if (!row) {
        return res.status(400).json({
          error: message.USER_NOT_FOUND,
        });
      }

      if (!description && !duration) {
        return res
          .status(400)
          .json({ error: message.DESCRIPTION_AND_DURATION_REQUIRED });
      }

      if (!description) {
        return res.status(400).json({ error: message.DESCRIPTION_REQUIRED });
      }

      if (!duration) {
        return res.status(400).json({ error: message.DURATION_REQUIRED });
      }

      const exerciseDate = date || new Date().toISOString().slice(0, 10);

      db.run(
        query.INSERT_INTO_EXERCISES,
        [userId, description, duration, exerciseDate],
        (err) => {
          if (err) {
            return res.status(500).json({ error: err.message });
          }
          res.json({
            userId,
            exerciseId: this.lastID,
            description,
            duration,
            date: exerciseDate,
          });
        }
      );
    });
  };

  getUsersExercises = (req, res) => {
    const userId = req._id;
    const { from, to, limit } = req.query;

    db.get(query.SELECT_EXERCISES_BY_USER_ID, [userId], (err, row) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }

      if (!row) {
        return res.status(400).json({
          error: message.USER_NOT_FOUND,
        });
      }

      let newQuery = query.SELECT_EXERCISES_BY_USER_ID;
      let params = [userId];

      if (from && to) {
        newQuery += " AND date BETWEEN ? AND ?";
        params.push(from, to);
      } else if (from) {
        newQuery += " AND date >= ?";
        params.push(from);
      } else if (to) {
        newQuery += " AND date <= ?";
        params.push(to);
      }

      newQuery += " ORDER BY date DESC";

      if (limit) {
        newQuery += " LIMIT ?";
        params.push(limit);
      }

      db.all(newQuery, params, (err, rows) => {
        if (err) {
          return res.status(500).json({ error: err.message });
        }
        db.get(query.COUNT_EXERCISES_BY_USER_ID, [userId], (err, result) => {
          if (err) {
            return res.status(500).json({ error: err.message });
          }
          res.json({ userId, logs: rows, count: result.count });
        });
      });
    });
  };
}

module.exports = ExercisesController;
