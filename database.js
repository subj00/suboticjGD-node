const sqlite3 = require("sqlite3").verbose();
const message = require("./constants/message.constants");
const query = require("./constants/query.contants");
const DATABASE_PATH = "./database.db";

const createTables = (database) => {
  const createTable = (query, message) => {
    database.serialize(() => {
      database.run(query, (error) => {
        if (error) {
          console.error(message, error.message);
        }
      });
    });
  };
  createTable(query.CREATE_TABLE_USERS, message.CREATE_TABLE_USERS_ERROR);
  createTable(
    query.CREATE_TABLE_EXERCISES,
    message.CREATE_TABLE_EXERCISES_ERROR
  );
};

const db = new sqlite3.Database(
  DATABASE_PATH,
  sqlite3.OPEN_READWRITE,
  (err) => {
    if (err) {
      console.error(message.DATABASE_CONNECTION_ERROR, err.message);
    } else {
      console.log(message.DATABASE_CONNECTED);
      createTables(db);
    }
  }
);

module.exports = db;
