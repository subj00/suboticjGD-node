const express = require("express");
const bodyParser = require("body-parser");
const app = express();
const cors = require("cors");
const router = express.Router();
const userRouter = require("./routes/user.routes.js")
require("dotenv").config();

app.use(cors());
app.use(express.static("public"));
app.get("/", (req, res) => {
  res.sendFile(__dirname + "/views/index.html");
});

const listener = app.listen(process.env.PORT || 3000, () => {
  console.log("Your app is listening on port " + listener.address().port);
});
