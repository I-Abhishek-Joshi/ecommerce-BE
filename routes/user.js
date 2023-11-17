const User = require("../models/User");
const CryptoJs = require("crypto-js");
const { verifyTokenAndAuthorization, verifyTokenAndAdmin } = require("./verifyToken");

const router = require("express").Router();

// UPDATE
router.put("/update/:id", verifyTokenAndAuthorization, async (req, res) => {
  if (req.body.password) {
    req.body.password = CryptoJs.AES.encrypt(
      req.body.password,
      process.env.AUTH_PASSWORD_SECRET
    ).toString();
  }

  try {
    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      {
        $set: req.body,
      },
      { new: true }
    );
    const { password, ...remainingFieldsOfUser } = updatedUser._doc;
    res.status(201).send(remainingFieldsOfUser);
  } catch (err) {
    return res.status(500).send(err);
  }
});

//DELETE

router.delete("/delete/:id", verifyTokenAndAuthorization, async (req, res) => {
    try {
        await User.findByIdAndDelete(req.params.id) 
        return res.status(200).send("user has been deleted");
    } catch (err) {
        return res.status.send(err);
    }
})

//GET USER
// only admin can get any other user
router.get("/find/:id", verifyTokenAndAdmin, async (req, res) => {
    try {
        const user = await User.findById(req.params.id) 
        const { password, ...remainingFieldsOfUser } = user._doc;
        return res.status(200).send(remainingFieldsOfUser);
    } catch (err) {
        return res.status.send(err);
    }
})

//GET ALL USER
// only admin can get any other user
router.get("/", verifyTokenAndAdmin, async (req, res) => {
    try {
        const users = await User.find(req.params.id) 
        return res.status(200).send(users);
    } catch (err) {
        return res.status.send(err);
    }
})


module.exports = router;
