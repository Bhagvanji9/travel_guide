const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const postSchema = new Schema({
  place: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  imageURL: {
    type: String,
    required: true,
  },
  user_Id: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
  },
});

module.exports = mongoose.model("Post", postSchema);
