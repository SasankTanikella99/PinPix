const mongoose = require("mongoose");

//13. using passport-local-mongoose for authentication
const plm = require('passport-local-mongoose')

mongoose.connect("mongodb://localhost:27017/pinterest")

//1. user schema
const UserSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,

  },
  posts: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Post", // ref is a referrence to Post model, this is the connection between User and Post
    },
  ],
  profile_picture: {
    type: String, // assuming profile picture is stored as a URL or file
  },
  email: {
    type: String,
    unique: true,
    required: true,
  },
  fullname: {
    type: String,
    required: true,
  },
});

//14. plugging in plm
UserSchema.plugin(plm)

// 2. creating a user model
const User = mongoose.model('User', UserSchema);

module.exports = User