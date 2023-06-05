const express = require("express");
const router = express.Router();
const guideController = require("../controller/guideController");
const homeController = require("../controller/homeController");
const posts = require("../data/posts.json").posts;

router.use(express.json());
router.use(express.urlencoded({ extended: true }));

// router.get("/Registeration", homeController.getRegisterPage);

router.get("/make-post", guideController.getMakePostPage);

router.post("/make-post", guideController.getPostData);

// router.get("/", homeController.goToHomePage);

module.exports = { router, posts };
