const express = require('express');
//get the router
const router = express.Router();

const FriendCtrl = require('../controllers/friends');
const AuthHelper = require('../helpers/AuthHelper');

//add the post router for friends endpoints
router.post('/follow-user', AuthHelper.VerifyToken, FriendCtrl.FollowUser);
router.post('/unfollow-user', AuthHelper.VerifyToken, FriendCtrl.UnFollowUser);
router.post('/mark/:id', AuthHelper.VerifyToken, FriendCtrl.MarkNotification);
//for marking the notifications in the dropdown in the toolbar
router.post(
  '/mark-all',
  AuthHelper.VerifyToken,
  FriendCtrl.MarkAllNotifications
);

//exported the router
module.exports = router;