var express = require("express");
var router = express.Router();

require("../models/connection");
const User = require("../models/users");

const { checkBody } = require("../modules/checkBody");
const uid2 = require("uid2");
const bcrypt = require("bcrypt");

/* GET users listing. */
router.get("/", function (req, res, next) {
  res.send("respond with a resource");
});

module.exports = router;

/*Post signin*/

router.post("/signin", (req, res) => {
  if (!checkBody(req.body, ["username", "password"])) {
    res.json({ result: false, error: "Missing or empty fields" });
    return;
  }

  User.findOne({ username: req.body.username }).then(data => {
    if (data && bcrypt.compareSync(req.body.password, data.password)) {
      res.json({ result: true, token: data.token });
    } else {
      res.json({ result: false, error: "User not found or wrong password" });
    }
  });
});

/*Post signup*/
function getRandomProfileImage() {
  const max = 5; // nombre total d'images
  const randomNum = Math.floor(Math.random() * max) + 1; // génère un nombre entre 1 et 5
  
  console.log(randomNum);
  
  return `profile${randomNum}.jpg`; // retourne le nom de l'image correspondante
}

router.post("/signup", (req, res) => {
  if (!checkBody(req.body, ["firstname", "username", "password"])) {
    res.json({ result: false, error: "Missing or empty fields" });
    return;
  }

  // Check if the user has not already been registered
  User.findOne({ username: req.body.username }).then(data => {
    if (data === null) {
      const hash = bcrypt.hashSync(req.body.password, 10);

      const newUser = new User({
        firstname: req.body.firstname,
        username: req.body.username,
        password: hash,
        token: uid2(32),
        profileImage: getRandomProfileImage(),
      });

      newUser.save().then(newDoc => {
        res.json({ result: true, token: newDoc.token });
      });
    } else {
      // User already exists in database
      res.json({ result: false, error: "User already exists" });
    }
  });
});
/* Get  user /:token*/
router.get("/:token", function (req, res) {
  const { token } = req.params;
  User.findOne({ token }).then(data => {
    res.json({ result: true, user: data });
  });
});
