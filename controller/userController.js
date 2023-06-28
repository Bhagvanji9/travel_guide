const User = require("../model/user");

exports.getGuideList = async (req, res) => {
  try {
    const users = await User.find();
    res.render("guide-list", {
      users,
      isAuth: req.session.isAuth,
    });
  } catch (err) {
    const error = new Error(err);
    error.httpStatusCode = 500;
    return next(error);
  }
};
