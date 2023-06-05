const express = require("express");

const router = express.Router();

const userController = require("../controller/userController");
const homeController = require("../controller/homeController");

router.use(express.json());
router.use(express.urlencoded({ extended: true }));

router.get("/home", homeController.goToHomePage);

router.get("/guide", userController.getGuideList);

module.exports = router;
