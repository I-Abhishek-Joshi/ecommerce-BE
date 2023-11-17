const router = require("express").Router();
const User = require("../models/User");
const CryptoJs = require("crypto-js");
const jwt = require("jsonwebtoken");

router.post("/register", async (req, res) => {
  console.log(req.body, "req body");
  const newUser = new User({
    username: req?.body?.username,
    email: req?.body?.email,
    password: CryptoJs.AES.encrypt(
      req.body.password,
      process.env.AUTH_PASSWORD_SECRET
    ),
  });
  console.log("user is", newUser);

  try {
    const savedUser = await newUser.save();
    res.status(201).send(savedUser);
  } catch (err) {
    console.log(err);
    res.status(500).send(err);
  }
});

router.post("/login", async (req, res) => {
  try {
    console.log("in login");
    const user = await User.findOne({ username: req.body.username });

    console.log("user in db is", user);
    if (!user) {
      return res.status(401).send("user not found");
    }
    const hashedPassword = CryptoJs.AES.decrypt(
      user.password,
      process.env.AUTH_PASSWORD_SECRET
    );
    const originalPassword = hashedPassword.toString(CryptoJs.enc.Utf8);

    if (originalPassword !== req.body.password) {
      return res.status(401).send("Wrong Credentials");
    }

    const accessToken = jwt.sign(
      {
        id: user._id,
        isAdmin: user.admin,
      },
      process.env.JWT_SECRET,
      { expiresIn: "3d" }
    );

    const { password, ...remainingFields } = user._doc;
    return res.status(200).send({...remainingFields, accessToken});
  } catch (err) {
    return res.status(500).send(err);
  }
});

module.exports = router;
