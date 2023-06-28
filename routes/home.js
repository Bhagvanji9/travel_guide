const express = require("express");
const router = express.Router();
const {
  getHomePage,
  getLoginPage,
  getRegisterData,
  getRegisterPage,
  login,
  logout,
} = require("../controller/homeController");
const { check, body } = require("express-validator");

router.use(express.json());
router.use(express.urlencoded({ extended: true }));

router.get("/", getHomePage);
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
  getRegisterData
);

router.get("/registeration", getRegisterPage);

router.post(
  "/login",
  [
    body("email")
      .notEmpty()
      .normalizeEmail()
      .withMessage("Please enter Email!"),
    body("psw").notEmpty().withMessage("Please Enter Password!"),
  ],
  login
);

router.get("/login", getLoginPage);

router.get("/logout", logout);

module.exports = router;
