const mongoose = require("mongoose");

const userSchema = mongoose.Schema({
  firstname: String,
  username: String,
  password: String,
  token: String,
  tweets: [{ type: mongoose.Schema.Types.ObjectId, ref: "tweets" }],
  profileImage: {
    type: String,
    default: "profil1.jpg"
  }
});

const User = mongoose.model("users", userSchema);

module.exports = User;
