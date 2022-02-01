const express = require('express');
//for allowing us to create routes by calling the router method
const router = express.Router();

const AuthController = require('../controllers/auth');

router.post('/register', AuthController.CreateUser);
router.post('/login', AuthController.LoginUser);

module.exports = router;