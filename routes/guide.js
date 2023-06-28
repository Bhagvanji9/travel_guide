const express = require("express");
const router = express.Router();
const guideController = require("../controller/guideController");
const { isAuth } = require("../controller/auth");
const multer = require("multer");
const storage = multer.diskStorage({
  destination: "./public/images",
  filename: (req, file, callback) => {
    callback(null, new Date().toISOString() + "-" + file.originalname);
  },
});

router.use(express.json());
router.use(express.urlencoded({ extended: true }));

router.get("/make-post", guideController.getMakePostPage);

router.post(
  "/make-post",
  multer({ storage: storage }).single("image"),
  guideController.getPostData
);

router.delete("/delete", guideController.deletePost);
router.get("/myPost", guideController.getMyPost);
router.get("/edit/:id", isAuth, guideController.getEditPost);

module.exports = { router };
