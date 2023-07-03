const User = require("../model/user");
const Post = require("../model/post");

exports.isAuth = async (req, res, next) => {
  try {
    const post = await Post.findById(req.params.id);
    if (req.session._id.equals(post.user_Id)) {
      return next();
    } else {
      throw Error("Unauthorized");
    }
  } catch (err) {
    const error = new Error(err);
    error.httpStatusCode = 401;
    return next(error);
  }
};

exports.isLogin = async (req, res, next) => {
  if (req.session._id) {
    next();
  } else {
    res.redirect("/login");
  }
};
