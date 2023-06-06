const express = require("express");

const router = express.Router();

const userController = require("../controller/userController");
const homeController = require("../controller/homeController");
const { auth } = require("../middleware/auth.js");

router.use(express.json());
router.use(express.urlencoded({ extended: true }));

router.get("/home", homeController.getHomePage);

router.get("/guide", auth, userController.getGuideList);

module.exports = router;
