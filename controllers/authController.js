// const userModel = require("../models/user-model");
// const bcrypt = require("bcrypt");
// const jwt = require("jsonwebtoken");
// const { generateToken } = require("../utils/generateToken");
// const registerUser = function (req, res) {
//   try {
//     let { email, password, fullname } = req.body;
//     bcrypt.genSalt(10, (err, salt) => {
//       bcrypt.hash(password, salt, async (err, hash) => {
//         if (err) return res.send(err.message);
//         else {
//           let user = await userModel.create({
//             email,
//             password: hash,
//             fullname,
//           });
//           let token = generateToken(user);
//           res.cookie("token", token);
//           res.send("User created");
//         }
//       });
//     });
//   } catch (err) {
//     console.log(err.message);
//   }
// };
// module.exports.registerUser = registerUser;
const userModel = require("../models/user-model");
const bcrypt = require("bcrypt");
const { generateToken } = require("../utils/generateToken");

async function registerUser(req, res) {
  try {
    let { email, password, fullname } = req.body;
    let alreadyuser = await userModel.findOne({ email: email });
    if (alreadyuser)
      return res.send("You already have an account. Please login");

    // Hash the password in one step using async/await
    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await userModel.create({
      email,
      password: hashedPassword, // Make sure you're saving the hashed password!
      fullname,
    });

    const token = generateToken(user);
    res.cookie("token", token);
    res.send("User created");
  } catch (err) {
    console.log(err.message);
    res.status(500).send("Server error during registration.");
  }
}
module.exports.loginUser = async function (req, res) {
  let { email, password } = req.body;
  let user = await userModel.findOne({ email });
  if (!user) return res.send("Email or Password is incorrect");
  bcrypt.compare(password, user.password, function (err, result) {
    if (result) {
      let token = generateToken(user);
      res.cookie("token", token);
      res.send("You can login");
    }
  });
};

// Export the function using a named export
module.exports.registerUser = registerUser;
