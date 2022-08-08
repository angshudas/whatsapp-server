const express = require('express');
const chatController = require('../controller/chatController');
const verifyJWT = require('../middleware/verifyJWT');

const router = express.Router();

router.use(verifyJWT);
router.route('/allchats').get(chatController.allChats);
router.route('/newchat').post(chatController.addNewChat);
// router.route('/sendmessage').post(chatController.sendMessage);
router.route('/join/:chat_id').get(chatController.joinChat);
// router.route('/messages').get(chatController.getMessages);


module.exports = router;