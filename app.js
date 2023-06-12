const express = require("express");
const bodyParser = require("body-parser");
const path = require("path");
const app = express();
const session = require("express-session");
const flash = require("connect-flash");
const multer = require("multer");
const fileStorage = multer.diskStorage({
  destination: (req, file, callback) => {
    callback(null, "images");
  },
  filename: (req, file, callback) => {
    callback(null, new Date().toISOString() + "-" + file.originalname);
  },
});
app.use(bodyParser.urlencoded({ extended: false }));
app.use(multer({ storage: fileStorage }).single("image"));
app.use(express.static(path.join(__dirname, "public")));

const userRoute = require("./routes/user.js");
const { router: guideRoute } = require("./routes/guide.js");
const homeRoute = require("./routes/home.js");

app.use(
  session({
    secret: "key",
    resave: false,
    saveUninitialized: false,
    cookie: {},
  })
);
app.use(flash());
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use("/", homeRoute);
app.use("/user", userRoute);
app.use("/guide", guideRoute);

app.use((req, res, next) => {
  res.status(404).render("404");
});
app.listen(3000, () => {
  console.log("listening at port number 3000");
});
