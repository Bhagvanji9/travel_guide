const fs = require("fs");
const path = require("path");
const bcrypt = require("bcrypt");
const users = require("../data/user.json").users;
const posts = require("../data/posts.json").posts;
const jsonDataPath = path.join(__dirname, "../", "data", "user.json");
const { validationResult } = require("express-validator");

exports.getHomePage = (req, res) => {
  const isAuth = req.session.isAuth;
  const role = req.session.role;
  res.render("home", { posts, isAuth, role });
};

exports.getRegisterPage = (req, res) => {
  let errorMessage = req.flash("error");
  if (errorMessage.length > 0) {
    errorMessage = errorMessage[0];
  } else {
    errorMessage = null;
  }
  res.render("register", { error: errorMessage });
};

exports.getRegisterData = async (req, res) => {
  error = validationResult(req);
  if (!error.isEmpty()) {
    return res.status(422).render("register", {
      error: error.array()[0].msg,
    });
  }

  if (
    users.find((user) => {
      return user.email == req.body.email;
    })
  ) {
    req.flash("error", "E-Mail exists already,enter other..");
    res.redirect("/registeration");
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
        delete getData.confirmPsw;
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
  error = validationResult(req);
  if (!error.isEmpty()) {
    return res.status(422).render("login", {
      error: error.array()[0].msg,
    });
  }
  fs.readFile(jsonDataPath, async (err, data) => {
    if (!err) {
      const users = JSON.parse(data.toString()).users;
      let validuser = users.find((element) => {
        return element.email === req.body.email;
      });
      if (!validuser) {
        req.flash("error", "Invalid email!");
        return res.redirect("/login");
      }
      bcrypt
        .compare(req.body.psw, validuser.psw)
        .then((isMatch) => {
          if (isMatch) {
            req.session.isAuth = true;
            req.session.role = validuser.role;
            return res.render("home", {
              posts,
              isAuth: req.session.isAuth,
              role: req.session.role,
            });
          } else {
            req.flash("error", "Invalid Password!,please enter valid password");
            res.redirect("/login");
          }
        })
        .catch((err) => {
          console.log(err);
          res.redirect("/login");
        });
    }
  });
};

exports.getLoginPage = (req, res) => {
  let errorMessage = req.flash("error");
  if (errorMessage.length > 0) {
    errorMessage = errorMessage[0];
  } else {
    errorMessage = null;
  }
  res.render("login", { error: errorMessage });
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
