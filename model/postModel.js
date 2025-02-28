//import mongoose
const mongoose = require("mongoose");

//create your schema
const schemaPost = new mongoose.Schema(
  {
    title: {
      type: String,
      require: true,
    },
    description: {
      type: String,
      require: true,
    },
    postPreview: {
      type: String,
      require: true,
    },
    postContent: {
      type: String,
      require: true,
    },
    //set the creator id to ensure that only the original user can post and delete. this is done using mongoose object id
    creatorId: {
      type: mongoose.Types.ObjectId,
      require: true,
      ref: "User",
    },
  },
  {
    timestamps: true,
  }
);

const postModel = mongoose.model("Post", schemaPost);

module.exports = postModel;
