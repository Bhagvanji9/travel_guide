const bcrypt = require("bcrypt");
const { validationResult, Result } = require("express-validator");
const mongoose = require("mongoose");
const User = require("../model/user");
const Post = require("../model/post");

const postInOnePage = 2;
exports.getHomePage = async (req, res, next) => {
  try {
    const isAuth = req.session.isAuth;
    const page = +req.query.page || 1;
    const role = req.session.role;
    const numberOfPost = await Post.find().count();
    let userId;
    if (req.session._id) {
      userId = req.session._id.toString();
    } else {
      userId = null;
    }
    const posts = await Post.find()
      .skip((page - 1) * postInOnePage)
      .limit(postInOnePage);
    return res.render("home", {
      posts,
      userId,
      isAuth,
      role,
      currentPage: page,
      totalPosts: numberOfPost,
      hasNextPage: postInOnePage * page < numberOfPost,
      hasPreviousPage: page > 1,
      nextPage: page + 1,
      previousPage: page - 1,
      lastPage: Math.ceil(numberOfPost / postInOnePage),
      isFilter: false,
      query: null,
    });
  } catch (err) {
    const error = new Error(err);
    error.httpStatusCode = 500;
    return next(error);
  }
};

exports.getRegisterPage = (req, res) => {
  let errorMessage = req.flash("error");
  if (errorMessage.length > 0) {
    errorMessage = errorMessage[0];
  } else {
    errorMessage = null;
  }
  res.render("register", { error: errorMessage });
};

exports.getRegisterData = async (req, res, next) => {
  let error = validationResult(req);
  if (!error.isEmpty()) {
    return res.status(422).render("register", {
      error: error.array()[0].msg,
    });
  }

  const isUserExists = await User.findOne({ email: req.body.email });

  if (isUserExists) {
    req.flash("error", "E-Mail exists already,enter other..");
    res.redirect("/registeration");
  } else {
    try {
      const { psw } = req.body;
      const salt = bcrypt.genSaltSync(10);
      const hash = await bcrypt.hash(psw, salt);
      const getData = req.body;
      getData.psw = hash;
      delete getData.confirmPsw;
      const newUser = new User(getData);
      newUser.save();

      res.redirect("/");
    } catch (err) {
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
    }
  }
};

exports.login = async (req, res, next) => {
  error = validationResult(req);
  if (!error.isEmpty()) {
    return res.status(422).render("login", {
      error: error.array()[0].msg,
    });
  }
  const isValidUser = await User.find({ email: req.body.email });

  if (isValidUser.length == 0) {
    req.flash("error", "Invalid email!");
    return res.redirect("/login");
  }

  try {
    const isMatch = await bcrypt.compare(req.body.psw, isValidUser[0].psw);

    if (isMatch) {
      req.session.isAuth = true;
      req.session._id = isValidUser[0]._id;
      req.session.role = isValidUser[0].role;
      res.redirect("/");
    } else {
      req.flash("error", "Invalid Password!,please enter valid password");
      res.redirect("/login");
    }
  } catch (err) {
    const error = new Error(err);
    error.httpStatusCode = 500;
    return next(error);
  }
};

exports.getLoginPage = (req, res) => {
  let errorMessage = req.flash("error");
  if (errorMessage.length > 0) {
    errorMessage = errorMessage[0];
  } else {
    errorMessage = null;
  }
  res.render("login", { error: errorMessage });
};

exports.logout = async (req, res) => {
  try {
    await req.session.destroy();
    res.redirect("/");
  } catch (err) {
    const error = new Error(err);
    error.httpStatusCode = 500;
    return next(error);
  }
};

exports.postComment = async (req, res) => {
  try {
    const comment = req.body.comment;
    const postId = req.body.postId;
    const user = await User.findById(req.session._id);
    const postObjectId = new mongoose.Types.ObjectId(postId);
    const totalComments = await Post.aggregate([
      { $match: { _id: postObjectId } },
      {
        $project: {
          totalComments: { $size: "$comments" },
        },
      },
    ]);
    await Post.findByIdAndUpdate(postId, {
      $set: {
        totalComments: totalComments[0].totalComments + 1,
      },
      $push: {
        comments: {
          content: comment,
          by: `${user.firstname} ${user.lastname} `,
        },
      },
    });
    return res.redirect("/");
  } catch (error) {
    console.log(error);
  }
};

exports.getSearch = async (req, res, next) => {
  const { query } = req.query;
  const isAuth = req.session.isAuth;
  const page = +req.query.page || 1;
  const role = req.session.role;

  const numberOfPost = await Post.find(
    { $text: { $search: query } },
    { score: { $meta: "textScore" } }
  ).count();

  const filterPosts = await Post.find(
    { $text: { $search: query } },
    { score: { $meta: "textScore" } }
  )
    .sort({ score: { $meta: "textScore" } })
    .skip((page - 1) * postInOnePage)
    .limit(postInOnePage);

  return res.render("home", {
    posts: filterPosts,
    isAuth,
    role,
    currentPage: page,
    totalPosts: numberOfPost,
    hasNextPage: postInOnePage * page < numberOfPost,
    hasPreviousPage: page > 1,
    nextPage: page + 1,
    previousPage: page - 1,
    lastPage: Math.ceil(numberOfPost / postInOnePage),
    isFilter: true,
    query: query,
  });
};

exports.getlikes = async (req, res, next) => {
  const postId = req.params.postId;
  const action = req.query.action;
  // const action = req.originalUrl.split("/")[1];
  const post = await Post.findById(postId);
  const userId = req.session._id.toString();

  await Post.findByIdAndUpdate(postId, {
    $addToSet: {
      [action]: userId,
    },
  });
  if (post.likes.map((element) => element.toString()).includes(userId)) {
    await Post.updateOne({ _id: postId }, { $pull: { likes: userId } });
  } else if (
    post.dislikes.map((element) => element.toString()).includes(userId)
  ) {
    await Post.updateOne({ _id: postId }, { $pull: { dislikes: userId } });
  }
  res.redirect("/");
};
