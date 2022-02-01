const express = require('express');
//get the router
const router = express.Router();

const MessageCtrl = require('../controllers/message');
const AuthHelper = require('../helpers/AuthHelper');

//get all messages of both users
router.get(
    '/chat-messages/:sender_Id/:receiver_Id',
    AuthHelper.VerifyToken,
    MessageCtrl.GetAllMessages
);

//for marking the messages and set the values that we want to send 
//to database as params: /:sender/:receiver
//we can either use this get or the following post method
router.get(
  '/receiver-messages/:sender/:receiver',
  AuthHelper.VerifyToken,
  MessageCtrl.MarkReceiverMessages
);

//mark all messages at notifications as read
router.get(
  '/all-messages-marked',
  AuthHelper.VerifyToken,
  MessageCtrl.AllMessagesMarked
);

//add the post router for chat message endpoints
router.post(
    '/chat-messages/:sender_Id/:receiver_Id',
    AuthHelper.VerifyToken,
    MessageCtrl.SendMessage
);

//exported the router
module.exports = router;