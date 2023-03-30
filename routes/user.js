const express = require('express');
const router = express.Router();
const user_controller = require("../controllers/user");
const Auth = require("../middlewares/auth");

router.post("/login", user_controller.login);
router.post("/register", user_controller.register);
router.get('/getUserById/:userId', user_controller.getUserById);


module.exports = router;