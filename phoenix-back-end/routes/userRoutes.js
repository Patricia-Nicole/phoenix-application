const express = require('express');
//get the router
const router = express.Router();

const UserCtrl = require('../controllers/users');
const AuthHelper = require('../helpers/AuthHelper');

//add the get router for users endpoints
router.get('/users', AuthHelper.VerifyToken, UserCtrl.GetAllUsers);
//get a user by its id
router.get('/user/:id', AuthHelper.VerifyToken, UserCtrl.GetUser);
//get a user by its username
//instead of using '/user/:username' we use '/username/:username'
//because otherwise it will take it as same as '/user/:id'
router.get(
    '/username/:username',
    AuthHelper.VerifyToken,
    UserCtrl.GetUserByName
);
router.post('/user/view-profile', AuthHelper.VerifyToken, UserCtrl.ProfileView);
//change password route
router.post(
    '/change-password',
    AuthHelper.VerifyToken,
    UserCtrl.ChangePassword
);
  
//exported the router
module.exports = router;