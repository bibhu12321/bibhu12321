const User = require("../models/user");
const jwt = require("jsonwebtoken");
require("dotenv").config();

exports.login = (req, res) => {
  const { email, password } = req.body;

  User.findOne({ email }).exec(async (err, user) => {
    if (err) throw err;
    if (!user) {
      return res.status(400).json({ status: 0, message: "User not found" });
    }
    const isMatch = await user.validatePassword(password);

    if (!isMatch) {
      return res
        .status(400)
        .json({ status: 0, message: "Password does not match" });
    }

    const payload = {
      id: user._id,
      name: user.name,
      email: user.email,
    };

    const token = jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });
    return res.status(200).json({
      id: user._id,
      name: user.name,
      email: user.email,
      gender: user.gender,
      token: token,
    });
  });
};

exports.register = (req, res) => {
  const { name, email, password } = req.body;

  User.findOne({ email }, async (err, user) => {
    if (err) throw err;
    if (user) {
      return res.status(400).json({
        status: 0,
        message: "Email is already registered",
      });
    }

    try {
      const userData = new User({ name, email, password });
      const user = await userData.save(userData);

      const payload = {
        id: user._id,
        name: user.name,
        email: user.email,
      };
      const token = jwt.sign(payload, process.env.JWT_SECRET, {
        expiresIn: "1h",
      });
      return res.status(200).json({
        id: user._id,
        name: user.name,
        email: user.email,
        token: token,
      });
    } catch (err) {
      res.status(400).json({
        status: 0,
        message: err,
      });
    }
  });
};

exports.getUserById = async (req, res) => {
  User.findById({ _id: req.params.userId }).exec((err, user) => {
    res.status(200).json({ user });
  });
};
