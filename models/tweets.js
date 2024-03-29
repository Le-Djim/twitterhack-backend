const mongoose = require("mongoose");

const tweetSchema = mongoose.Schema({
  token: String,
  tweet: String,
  timestamp: Number,
  user: { type: mongoose.Schema.Types.ObjectId, ref: "users" },
});

const Tweet = mongoose.model("tweets", tweetSchema);
module.exports = Tweet;
