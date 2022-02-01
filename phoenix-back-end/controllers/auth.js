//joi = Object Based Schema Validator
//joi is used in order to validate date before it is added to the schema
const Joi = require('joi');
//check status of pages
const HttpStatus = require('http-status-codes');
//bcrypt to hash the passwords
const bcrypt = require('bcryptjs');
//jsonwebtoken -> public/private key
const jwt = require('jsonwebtoken');

const User = require('../models/user');
const Helpers = require('../helpers/helpers');
//the secret key
const dbConfig = require('../config/secret');

module.exports = {
    async CreateUser(req, res) {
        const schema = Joi.object().keys({
            username: Joi.string()
                .min(5)
                .max(10)
                .required(),
            email: Joi.string()
                .email()
                .required(),
            password: Joi.string()
                .min(6)
                .required()
        });

        //check if there is an error at the user schema
        //from now if we use value of req.body same thing
        const { error, value } = schema.validate(req.body)
        //console.log(value);
        if (error && error.details){
            return res.status(HttpStatus.BAD_REQUEST)
            .json({ msg: error.details });
        }

        const userEmail = await User.findOne({ email: Helpers.lowerCase( req.body.email ) });
        if (userEmail) {
            return res.status(HttpStatus.CONFLICT).json({ message: "Email already exists" });
        }

        const userName = await User.findOne({ username: Helpers.firstUpper(req.body.username) });
        if (userName){
            return res.status(HttpStatus.CONFLICT).json({ message: "Username already exists" });
        }

        return bcrypt.hash(value.password, 10, (err, hash) => {
            //if there is an error whily trying to bcrypt we return that status code and message
            if (err) {
                return res.status(HttpStatus.BAD_REQUEST).json({message: "Error hashing password" });
            }
            //otherwise we create a new object with the new values
            const body = {
                username: Helpers.firstUpper(value.username),
                email: Helpers.lowerCase( value.email ),
                password: hash
            };
            //create method is from mongoose
            //if it is created successfully then we send the following message
            User.create(body).then((user) => {
                //when the user was created successfully, then we sign the token
                //pass the user, which is an object + secret key
                const token = jwt.sign({ data: user }, dbConfig.secret, {
                    //it will expire in 120 miliseconds
                    expiresIn: 120
                }); 
                //auth will be the key and token the value
                res.cookie('auth', token);
                res.status(HttpStatus.CREATED).json({message: "User created successfully", user, token });
            //otherwise we call the catch method
            }).catch(err => {
                res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({message: "Error occured" });
            });
        });
    }, 
    //LOGIN SYSTEM
    async LoginUser(req, res) {
        //if there is no user or password implemented
        if (!req.body.username || !req.body.password) {
          return res
            .status(HttpStatus.INTERNAL_SERVER_ERROR)
            .json({ message: 'No empty fields allowed' });
        }
        //if exists
        await User.findOne({ username: Helpers.firstUpper(req.body.username) })
        .then(user => {
            //check the user if he/she is in the database
            if (!user) {
                return res
                    .status(HttpStatus.NOT_FOUND)
                    .json({ message: 'Username not found' });
            }
            //if we found the user, compare the password implemented 
            //with the one in the database
            //it will be decrypted and then compared
            return bcrypt.compare(req.body.password, user.password)
            .then((result) => {
                //if there is no match 
                if(!result) {
                    return res
                        .status(HttpStatus.INTERNAL_SERVER_ERROR)
                        .json({ message: 'Password is incorrect' });
                }
                //if the password matches the we send the user
                //send a token with user object
                //set the cookie
                //and return the ok status code
                const token = jwt.sign({ data: user }, dbConfig.secret, 
                    {
                        expiresIn: '5h'
                    });
                res.cookie('auth', token);
                return res.status(HttpStatus.OK).json({ message: 'Login successful', user, token })
            })
        })
        .catch(err => {
            return res
                .status(HttpStatus.INTERNAL_SERVER_ERROR)
                .json({ message: 'Error occured' });
        })
    }
};