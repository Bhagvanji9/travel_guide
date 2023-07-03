const express = require("express");
const router = express.Router();
const homeController = require("../controller/homeController");

const { check, body } = require("express-validator");
const { isLogin } = require("../controller/auth");

router.use(express.json());
router.use(express.urlencoded({ extended: true }));

router.get("/", homeController.getHomePage);
router.post(
  "/registeration",
  [
    check("email")
      .isEmail()
      .withMessage("Invalid Email,Please enter corrent...")
      .trim(),
    body("psw")
      .isLength({ min: 8 })
      .withMessage("Password must be at least 8 characters long")
      .matches(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]+$/
      )
      .withMessage(
        "Password must contain at least one uppercase letter, one lowercase letter, one special symbol, and one number"
      ),
    body("confirmPsw")
      .custom((value, { req }) => value !== req.body.password)
      .withMessage("Passwords do not match"),
  ],
  homeController.getRegisterData
);

router.get("/registeration", homeController.getRegisterPage);

router.post(
  "/login",
  [
    body("email")
      .notEmpty()
      .normalizeEmail()
      .withMessage("Please enter Email!"),
    body("psw").notEmpty().withMessage("Please Enter Password!"),
  ],
  homeController.login
);

router.get("/login", homeController.getLoginPage);
router.post("/add-comment", isLogin, homeController.postComment);

router.get("/logout", homeController.logout);
router.get("/search", homeController.getSearch);
router.get("/:like/:postId", isLogin, homeController.getlikes);

module.exports = router;
