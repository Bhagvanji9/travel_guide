const express = require("express");
const path = require("path");
const fs = require("fs");
const router = express.Router();

const homeController = require("../controller/homeController");
const { auth } = require("../middleware/auth.js");
const { visitor } = require("../middleware/visitor.js");

router.use(express.json());
router.use(express.urlencoded({ extended: true }));

router.get("/", visitor, homeController.getHomePage);

router.post("/registeration", homeController.getRegisterData);

router.get("/registeration", homeController.getRegisterPage);

router.post("/login", homeController.login);

router.get("/login", homeController.getLoginPage);

router.get("/logout", auth, homeController.logout);

module.exports = router;
