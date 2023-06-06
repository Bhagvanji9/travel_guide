const jwt = require("jsonwebtoken");
exports.auth = (req, res, next) => {
  const token = req.cookies.token;
  const secret = process.env.JWT_TOKEN_ACCESS;
  jwt.verify(token, secret, (err, user) => {
    if (err) {
      switch (err.name) {
        case "TokenExpiredError":
          console.log(err);
          res.clearCookie("token");
          res.redirect("/login");
          break;
        default:
          console.log(err);
          res.redirect("/");
          break;
      }
    } else {
      req.body.user = user;

      next();
    }
  });
};
