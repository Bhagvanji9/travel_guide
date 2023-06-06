const jwt = require("jsonwebtoken");
exports.visitor = (req, res, next) => {
  const isCookie = req.cookies;

  if (isCookie && req.cookies.token) {
    const token = req.cookies.token;
    const secret = process.env.JWT_TOKEN_ACCESS;
    jwt.verify(token, secret, (err, user) => {
      if (!err) {
        req.body.user = user;
        return;
      } else {
        console.log(err);
      }
      return next();
    });
  }
  return next();
};
