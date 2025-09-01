const express = require("express");
const router = express.Router();
const userModel = require("../models/user-model");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

router.get("/", (req, res) => {
  res.send("hey");
});
router.post("/register", async (req, res) => {
  try {
    let { email, password, fullname } = req.body;
    bcrypt.genSalt(10, (err, salt) => {
      bcrypt.hash(password, salt, async (err, hash) => {
        if (err) return res.send(err.message);
        else {
          let user = await userModel.create({
            email,
            password: hash,
            fullname,
          });
          let token = jwt.sign({ email, id: user._id }, process.env.JWT_KEY);
          res.cookie("token", token);
          res.send("User created");
        }
      });
    });
  } catch (err) {
    console.log(err.message);
  }
});
module.exports = router;
