require("dotenv").config();
const jwt = require("jsonwebtoken");
const UserModel = require("../models/user");


module.exports = (req, res, next) => {
  const [tokenType, token] = req.headers.authorization.split(" ");

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    UserModel.findOne({ email: decoded.email }, async (err, user) => {
      if (err) throw err;
      if (!user) {
        res.status(403).json({ status: 0, message: "Invalid credentials" });
      }
      req.user_id = decoded.id;
      next();
    });
  } catch (err) {
    return res.status(403).json({ status: 0, message: err.message });
  }
};
