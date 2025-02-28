const mongoose = require("mongoose");

//create the model users are to follow in creating their account
const user = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
    },
    lastName: {
      type: String,
      required: true,
    },
    age: {
      type: Number,
      required: true,
    },
    email: {
      type: String,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    kyc: {
      type: mongoose.Types.ObjectId,
      ref: "kyc",
    },
    post: [{ type: mongoose.Types.ObjectId, ref: "Post" }],
  },
  {
    timestamps: true,
  }
);

const userModel = mongoose.model("User", user);

//export your userModel
module.exports = userModel;
