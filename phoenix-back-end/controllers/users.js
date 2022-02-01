const User = require('../models/user');
const HttpStatus = require('http-status-codes');
const moment = require('moment');
const Joi = require('joi');
const bcrypt = require('bcryptjs');

module.exports = {
    
    //return all users that are registered in the database
    async GetAllUsers(req, res) {
        //find method returns an object inside an array
        //we pass as parameter an empty object which will 
        //return all users
        await User.find({})
        //populate the particular field posts(which is an array)
        //from models/user.js -> posts
        //when returning the user
            .populate('posts.Post')
            .populate('following.userFollowed')
            .populate('followers.follower')
            //from chatList from models/user.js
            .populate('chatList.receiverId')
            .populate('notifications.senderId')
            .populate('chatList.msgId')
            .then((result) => {
                res.status(HttpStatus.OK).json({message: 'All users', result});
            }).catch(err => {
                res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({message: 'Error when finding the users'});
            })
    },

    async GetUser(req, res) {
        //find one user by its id
        await User.findOne({ _id: req.params.id })
        //populate the particular field posts(which is an array)
        //from models/user.js -> posts
        //when returning the user
            .populate('posts.Post')
            .populate('following.userFollowed')
            .populate('followers.follower')
            //from chatList from models/user.js
            .populate('chatList.receiverId')
            .populate('notifications.senderId')
            .populate('chatList.msgId')
            .then((result) => {
                res.status(HttpStatus.OK).json({message: 'User by id', result});
            }).catch(err => {
                res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({message: 'Error when finding the user by id'});
            })
    },

    async GetUserByName(req, res) {
        //find one user by its username
        await User.findOne({ username: req.params.username })
        //populate the particular field posts(which is an array)
        //from models/user.js -> posts
        //when returning the user
            .populate('posts.Post')
            .populate('following.userFollowed')
            .populate('followers.follower')
            //from chatList from models/user.js
            .populate('chatList.receiverId')
            .populate('notifications.senderId')
            .populate('chatList.msgId')
            .then((result) => {
                res.status(HttpStatus.OK).json({message: 'User by username', result});
            }).catch(err => {
                res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({message: 'Error when finding the user by username'});
            })
    },

    //when a user views our profile
    async ProfileView(req, res) {
        //console.log(req.body);
        //show if a user views just once a day, not multiple times a day
        //also be able to view just at others and receive notification

        //the date will be a string -> see models/user.js
        //use moment to create a date format
        const dateValue = moment().format('YYYY-MM-DD');
        await User.update(
        {
            //once it finds the document, is going to 
            //check inside the notification array
            //if the date value(string) is != dateValue
            //if it is egual, the user already viewed the profile that particular day
            //if a user views 10 times a day, it will be just one notification
            _id: req.body.id,
            //[dateValue, ''] check also if date is not empty
            'notifications.date': { $ne: [dateValue, ''] },
            //check to make sure that senderId is not already existing
            'notifications.senderId': { $ne: req.user._id }
        },
        {
        $push: {
            notifications: {
                senderId: req.user._id,
                message: `${req.user.username} viewed your profile`,
                created: new Date(),
                date: dateValue,
                viewProfile: true
            }
        }
        }
        )
        .then(result => {
            res.status(HttpStatus.OK).json({ message: 'Notification sent' });
        })
        .catch(err => {
            res
            .status(HttpStatus.INTERNAL_SERVER_ERROR)
            .json({ message: 'Error occured at notification on view profile' });
        });
    }, 

    async ChangePassword(req, res) {
        const schema = Joi.object().keys({
          cpassword: Joi.string().required(),
          newPassword: Joi.string()
            .min(6)
            .required(),
          confirmPassword: Joi.string()
            .min(6)
            .required()
        });
        //check for the errors and value
        const { error, value } = schema.validate(req.body);
        if (error && error.details) {
          return res.status(HttpStatus.BAD_REQUEST).json({ msg: error.details });
        }
    
        //find the user by id
        const user = await User.findOne({ _id: req.user._id });
    
        //compare the two passwords -> one from input field and one from database
        return bcrypt.compare(value.cpassword, user.password).then(async result => {
            //if there is not result after comparing them -> they don't match
            if (!result) {
            return res
              .status(HttpStatus.INTERNAL_SERVER_ERROR)
              .json({ message: 'Current password is incorrect' });
            }
    
            //from models/user.js
            const newpassword = await User.EncryptPassword(req.body.newPassword);
            await User.update(
            {
                //get the document by id
              _id: req.user._id
            },
            {
            //set the password field to the new field
              password: newpassword
            }
            )
            .then(() => {
              res
                .status(HttpStatus.OK)
                .json({ message: 'Password changed successfully' });
            })
            .catch(err => {
              res
                .status(HttpStatus.INTERNAL_SERVER_ERROR)
                .json({ message: 'Error occured changing the password' });
            });
        });
    }
};