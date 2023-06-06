const express = require("express");

const path = require("path");

const app = express();

const cookieParser = require("cookie-parser");

app.use(express.static(path.join(__dirname, "public")));

const userRoute = require("./routes/user.js");
const { router: guideRoute } = require("./routes/guide.js");
const homeRoute = require("./routes/home.js");

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(cookieParser());

app.use("/", homeRoute);
app.use("/user", userRoute);
app.use("/guide", guideRoute);

app.use((req, res, next) => {
  res.render("404");
});
app.listen(3000, () => {
  console.log("listening at port number 3000");
});
