const router = require("express").Router();
const messageController = require('../controllers/message');

router.post("/new-message", messageController.newMessage)
router.get("/messages/:conversationId", messageController.getMessage);

module.exports = router;