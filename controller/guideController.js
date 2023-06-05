const fs = require("fs");
const { isUtf8 } = require("buffer");
const path = require("path");
const { Module } = require("module");
const jsonDataPath = path.join(__dirname, "../", "data", "posts.json");

exports.getMakePostPage = (req, res) => {
  res.render("make-post");
};

exports.getPostData = async (req, res, next) => {
  fs.readFile(jsonDataPath, "utf8", (err, jsonData) => {
    if (!err) {
      const postsArray = JSON.parse(jsonData.toString()).posts;
      const getData = req.body;
      postsArray.push(getData);

      const postsString = '{"posts":' + JSON.stringify(postsArray) + "}";

      fs.writeFile(jsonDataPath, postsString, "utf8", (err, data) => {
        if (err) {
          throw err;
        }
        res.redirect("/");
      });
    }
  });
};
