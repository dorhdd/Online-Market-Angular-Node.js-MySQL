const express = require("express");
const app = express();
const port = 4200;
const path = require("path");
const bodyParser = require("body-parser");
var cookieParser = require("cookie-parser");
var cors = require("cors");
var con = require("./connection");
var options = require("./connection").options;

const session = require("express-session");
var MySQLStore = require("express-mysql-session")(session);
var sessionStore = new MySQLStore(options, con);
app.use(
  session({
    key: "session_cookie_name",
    secret: "session_cookie_secret",
    store: sessionStore,
    resave: false,
    saveUninitialized: true,
  })
);

var logSignReq = require("./logSignReq");
var homePageReq = require("./homePageReq");
var orderReq = require("./orderReq");
var recipeReq = require("./recipeReq");

app.use(bodyParser.json());
app.use(cookieParser());
app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use("/server/images", express.static("server/images"));
app.use(express.static(path.join(__dirname, "../dist/onlineMarket")));

app.use("/start", logSignReq);
app.use("/homePage", homePageReq);
app.use("/order", orderReq);
app.use("/receipt", recipeReq);

app.get("*", (req, res) => {
  res.sendFile(
    path.resolve(path.join(__dirname, "../dist/onlineMarket/index.html"))
  );
});

app.listen(port, () =>
  console.log(`app listening at http://localhost:${port}`)
);
