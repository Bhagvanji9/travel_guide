const fs = require("fs");
const jwt = require("jsonwebtoken");
const path = require("path");
const bcrypt = require("bcrypt");
require("dotenv").config();

const users = require("../data/user.json").users;
const { posts } = require("../routes/guide.js");
const userJsonDataPath = path.join(__dirname, "../", "data", "user.json");

exports.getHomePage = (req, res, next) => {
  const isAuth = req.cookies.token;

  let role;
  if (req.body.user === undefined) {
    role = undefined;
  } else {
    role = req.body.user.role;
  }
  fs.readFile(userJsonDataPath, (err, data) => {
    const users = JSON.parse(data.toString()).users;
    res.render("home", { posts, isAuth, users, role });
  });
};

exports.getRegisterPage = (req, res) => {
  res.render("register", { err: false });
};

exports.getRegisterData = async (req, res, next) => {
  if (
    users.find((user) => {
      return user.email == req.body.email;
    })
  ) {
    res.render("register", { err: true });
  } else {
    fs.readFile(userJsonDataPath, "utf8", async (err, jsonData) => {
      if (!err) {
        const { psw } = req.body;
        const saltRounds = 10;
        const salt = bcrypt.genSaltSync(saltRounds);
        const hash = await bcrypt.hash(psw, salt);
        const postsArray = JSON.parse(jsonData.toString()).users;
        const getData = req.body;
        getData.psw = hash;
        postsArray.push(getData);
        const postsString = '{"users":' + JSON.stringify(postsArray) + "}";
        fs.writeFile(userJsonDataPath, postsString, "utf8", (err, data) => {
          if (err) {
            console.log(err);
          }
          res.redirect("/");
        });
      }
    });
  }
};

exports.login = (req, res) => {
  fs.readFile(userJsonDataPath, async (err, data) => {
    if (!err) {
      const users = JSON.parse(data.toString()).users;
      let validuser = users.find((element) => {
        return element.email === req.body.email;
      });
      if (validuser && (await bcrypt.compare(req.body.psw, validuser.psw))) {
        const secret = process.env.JWT_TOKEN_ACCESS;
        const token = jwt.sign(
          {
            isAuth: true,
            role: validuser.role,
          },
          secret,
          { expiresIn: "3m" }
        );
        console.log("login successfully!");
        res.cookie("token", token, { httpOnly: true }).redirect("/");
      } else {
        res.redirect("login");
      }
    }
  });
};

exports.getLoginPage = (req, res) => {
  res.render("login");
};
exports.logout = (req, res) => {
  res.clearCookie("token").redirect("/");
};
