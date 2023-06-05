const path = require("path");
const fs = require("fs");
const jsonDataPath = path.join(__dirname, "../", "data", "user.json");

exports.getGuideList = (req, res) => {
  fs.readFile(jsonDataPath, (err, data) => {
    const users = JSON.parse(data.toString()).users;

    res.render("guide-list", {
      users,
      isAuth: req.session.isAuth,
    });
  });
};
