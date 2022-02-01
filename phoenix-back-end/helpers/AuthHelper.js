//get the token from controllers-auth
const jwt = require('jsonwebtoken');
const dbConfig = require('../config/secret');
const HttpStatus = require('http-status-codes');
//check if the token is available
//check if it didn't expired
//if it is still valid, then the user will be able to do
//whatever he/she wants to do on the particular router
module.exports = {
    //this method will be called on each router
    VerifyToken: (req, res, next) => {
        if(!req.headers.authorization) {
            return res
            .status(HttpStatus.UNAUTHORIZED)
            .json({ message: 'No Authorization' });
        }
        //save the token into cookies
        //get token from authorization
        const token = req.cookies.auth || req.headers.authorization.split(' ')[1];
        //console.log(token);
        //if the token is not available
        if(!token) {
            return res
            .status(HttpStatus.FORBIDDEN)
            .json({ message: 'No token provided' });
        }
        //verify is token is valid
        return jwt.verify(token, dbConfig.secret, (err, decoded) => {
            if(err) {
                //check if the expired value is less than the current date
                if(err.expiredAt < new Date()) {
                    return res
                    .status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .json({ message: 'Token has expired. Please login again', token: null });
                }
                //if token is still valid
                next();
            }
            //the decoded value will contain the data object
            req.user = decoded.data;
            next();
        });
    }
}