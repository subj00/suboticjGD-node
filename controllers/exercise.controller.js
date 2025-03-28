const query = require("../constants/query.contants");
const message = require("../constants/message.constants");
const db = require("../database.");

class ExercisesController {
  createExerciseForUser = (req, res) => {
    const userId = req._id;

    const isValidDate = (dateString) => {
      const regex = /^\d{4}-\d{2}-\d{2}$/;
      if (!dateString.match(regex)) return false;
      const parts = dateString.split("-");
      const year = parseInt(parts[0], 10);
      const month = parseInt(parts[1], 10);
      const day = parseInt(parts[2], 10);

      if (month < 1 || month > 12) return false;
      if (day < 1 || day > 31) return false;

      const monthLengths = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];

      if (month === 2) {
        const isLeap = (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0;
        if (isLeap && day > 29) return false;
        if (!isLeap && day > 28) return false;
      } else {
        if (day > monthLengths[month - 1]) return false;
      }

      return true;
    };

    const { description, duration, date } = req.body;

    db.get(query.SELECT_BY_USER_ID, [userId], (err, row) => {
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

      if (duration <= 0 || isNaN(duration)) {
        return res.status(400).json({
          error: message.DURATION_MUST_BE_POSITIVE_NUMBER,
        });
      }

      const exerciseDate = date || new Date().toISOString().slice(0, 10);

      if (!isValidDate(exerciseDate)) {
        return res.status(400).json({ error: message.INVALID_DATE });
      }

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

      newQuery += " ORDER BY date ASC";

      if (limit) {
        newQuery += " LIMIT ?";
        params.push(limit);
      }

      db.all(newQuery, params, (err, rows) => {
        if (err) {
          return res.status(500).json({ error: err.message });
        }
        let count = rows?.length;
        res.json({ userId, logs: rows, count: count });
      });
    });
  };
}

module.exports = ExercisesController;
