const fs = require("fs");

const path = require("path");
const bcrypt = require("bcrypt");

const users = require("../data/user.json").users;

const posts = require("../data/posts.json").posts;

const jsonDataPath = path.join(__dirname, "../", "data", "user.json");

exports.goToHomePage = (req, res) => {
  res.render("home");
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
    fs.readFile(jsonDataPath, "utf8", async (err, jsonData) => {
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

        fs.writeFile(jsonDataPath, postsString, "utf8", (err, data) => {
          if (err) {
            throw err;
          }
          res.redirect("/");
        });
      }
    });
  }
};

exports.login = (req, res) => {
  fs.readFile(jsonDataPath, async (err, data) => {
    if (!err) {
      const users = JSON.parse(data.toString()).users;
      let validuser = users.find((element) => {
        return element.email === req.body.email;
      });

      if (validuser && (await bcrypt.compare(req.body.psw, validuser.psw))) {
        req.session.isAuth = true;
        req.session.role = validuser.role;
        console.log("login successfully!");

        res.render("home", {
          posts,
          isAuth: req.session.isAuth,
          role: req.session.role,
        });
      } else {
        res.redirect("login");
      }
    }
  });
};

exports.getLoginPage = (req, res) => {
  res.render("login", { posts });
};
exports.logout = (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      console.log("Error destroying session:", err);
    } else {
      res.redirect("/");
    }
  });
};
