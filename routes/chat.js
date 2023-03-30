const express = require('express');
const router = express.Router();
const user_controller = require("../controllers/user");
const chatController = require("../controllers/chat");
const Auth = require("../middlewares/auth");

router.get("/get-users",Auth, chatController.getUsers);
router.get('/conversation', Auth, chatController.getConversations);
router.post('/conversation/new/:receiverId', Auth, chatController.newConversion);
router.post('/conversation/all/:receiverId', Auth, chatController.allConversation);
module.exports = router;