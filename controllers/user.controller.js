const query = require("../constants/query.contants");
const message = require("../constants/message.constants");
const db = require("../database");

class UserController {
  createUser = (req, res) => {
    const { username } = req.body;
    if (!username) {
      return res.status(400).json({ error: message.USERNAME_REQUIRED });
    }

    db.get(query.SELECT_USER_BY_USERNAME, [username], (err, row) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }

      if (row) {
        return res.status(400).json({
          error: message.USERNAME_ALREADY_EXISTS,
        });
      }

      db.run(query.INSERT_INTO_USERS, [username], function (err) {
        if (err) {
          return res.status(500).json({ error: err.message });
        }
        res.json({ id: this.lastID, username });
      });
    });
  };

  getAllUsers = (_, res) => {
    db.all(query.SELECT_ALL_USERS, (err, users) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      if (!users) {
        return res.status(404).json({ error: message.TABLE_USERS_EMPTY });
      }
      res.json(users);
    });
  };
}

module.exports = UserController;
