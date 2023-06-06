const express = require("express");
const router = express.Router();
const guideController = require("../controller/guideController");
const homeController = require("../controller/homeController");
const posts = require("../data/posts.json").posts;
const { auth } = require("../middleware/auth.js");

router.use(express.json());
router.use(express.urlencoded({ extended: true }));

router.get("/make-post", auth, guideController.getMakePostPage);

router.post("/make-post", guideController.getPostData);

module.exports = { router, posts };
