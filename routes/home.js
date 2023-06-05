const express = require("express");
const path = require("path");
const fs = require("fs");
const router = express.Router();
const { posts } = require("../routes/guide.js");
const userJsonDataPath = path.join(__dirname, "../", "data", "user.json");
const homeController = require("../controller/homeController");

router.use(express.json());
router.use(express.urlencoded({ extended: true }));

router.get("/", (req, res, next) => {
  const isAuth = req.session.isAuth;
  fs.readFile(userJsonDataPath, (err, data) => {
    const users = JSON.parse(data.toString()).users;

    res.render("home", { posts, isAuth, users });
  });
});

router.post("/registeration", homeController.getRegisterData);

router.get("/registeration", homeController.getRegisterPage);

router.post("/login", homeController.login);

router.get("/login", homeController.getLoginPage);

router.get("/logout", homeController.logout);

module.exports = router;
