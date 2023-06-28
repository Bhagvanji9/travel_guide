const express = require("express");
const bodyParser = require("body-parser");
const path = require("path");
const app = express();
const session = require("express-session");
const MongoDBStore = require("connect-mongodb-session")(session);
const flash = require("connect-flash");
const mongoose = require("mongoose");
require("dotenv").config();

const { err } = require("./middelware/error.js");
const userRoute = require("./routes/user.js");
const { router: guideRoute } = require("./routes/guide.js");
const homeRoute = require("./routes/home");
app.set("views", path.join(__dirname, "views"));

mongoose
  .connect(process.env.DB_URL)
  .then((result) => {
    console.log("database conncted!!!");
  })
  .catch((err) => console.log(err));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));
app.use(
  session({
    store: new MongoDBStore({
      uri: process.env.DB_URL,
      expiresAfterSeconds: 60 * 1000 * 60,
    }),
    secret: process.env.SECRET_TOKEN,
    resave: false,
    saveUninitialized: false,
    cookie: { maxAge: 60 * 1000 * 60 },
  })
);
app.use(flash());
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use("/", homeRoute);
app.use("/user", userRoute);
app.use("/guide", guideRoute);

app.use((req, res, next) => {
  const error = new Error("Page not found");
  error.httpStatusCode = 404;
  next(error);
});

app.use(err);

app.listen(3000, () => {
  console.log("listening at port number 3000");
});
