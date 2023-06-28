const Post = require("../model/post");

exports.getMakePostPage = (req, res) => {
  res.render("make-post", {
    action: "New Post",
  });
};

exports.getPostData = async (req, res, next) => {
  const isPostId = req.body.postId;
  const place = req.body.place;
  const description = req.body.description;
  const imageURL = req.file.filename;
  const user_Id = req.session._id;

  if (isPostId) {
    await Post.updateOne(
      { _id: isPostId },
      {
        $set: {
          place: place,
          description: description,
          imageURL: imageURL,
          user_Id: user_Id,
        },
      }
    );
    return res.redirect("/");
  }

  const post = new Post({
    place: place,
    description: description,
    imageURL: imageURL,
    user_Id: user_Id,
  });
  post
    .save()
    .then((result) => {
      console.log("post created!!");
      return res.redirect("/");
    })
    .catch((err) => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
    });
};

exports.deletePost = async (req, res) => {
  await Post.deleteOne({ _id: req.body.postId });

  return res.json({ resLocation: "/guide/myPost" });
};
exports.getMyPost = async (req, res, next) => {
  const isAuth = req.session.isAuth;
  const page = +req.query.page || 1;
  const role = req.session.role;
  const postInOnePage = 2;
  const numberOfPost = await Post.find({ user_Id: req.session._id }).count();
  const posts = await Post.find({ user_Id: req.session._id })
    .skip((page - 1) * postInOnePage)
    .limit(postInOnePage);
  return res.render("myPost", {
    posts,
    isAuth,
    role,
    currentPage: page,
    totalPosts: numberOfPost,
    hasNextPage: postInOnePage * page < numberOfPost,
    hasPreviousPage: page > 1,
    nextPage: page + 1,
    previousPage: page - 1,
    lastPage: Math.ceil(numberOfPost / postInOnePage),
  });
};
exports.getEditPost = async (req, res, next) => {
  const postId = req.params.id;
  const witchPost = await Post.findById(postId);
  res.render("make-post", {
    witchPost,
    action: "Edit Post",
  });
};
