var express = require("express");
var router = express.Router();
const Tweet = require("../models/tweets");
const User = require("../models/users");
const { checkBody } = require("../modules/checkBody");

/*GET pour lire les tweets*/
router.get("/all", (req, res) => {
  Tweet.find({})
    .populate("user")
    .then(data => res.json({ result: true, tweets: data }));
});

/* POST pour poster un tweet*/
router.post("/send", (req, res) => {
  console.log(req.body);
  const { token, tweet, timestamp } = req.body;

  /* Vérifier les champs de saisis */
  if (!checkBody(req.body, ['tweet'])) {
    res.json({ result: false, error: "Please enter a tweet first !" });
    return;
  }

User.findOne({ token }).then(data => {
  if (!data) {
    return res.json({ result: false, error: "User not found!" });
  }
  const newTweet = new Tweet({ tweet, timestamp, user: data._id });
  newTweet.save().then(() => res.json({ result: true }));
});
})

/* Delete pour supprimer un tweet*/
router.delete("/delete/:tweetId", (req, res) => {
  const { tweetId } = req.params;
  Tweet.findByIdAndDelete(tweetId).then(() => res.json({ result: true }));
});

module.exports = router;
