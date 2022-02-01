const express = require('express');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
//const logger= require('morgan');
const cors = require('cors');
const _ = require('lodash');

const app = express();
//the headers are set here and we do not need the below header commented
app.use(cors());
/*app.use((req, res, next)  => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Credentials', 'true');
    res.header('Access-Control-Allow-Methods', 'GET', 'POST', 'DELETE', 'PUT', 'OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
    next();
});*/

//Socket.io integrated with nodejs http method
//by requiring http module, calling the create server
//and passing app which is an instance of this express application
const http = require('http');
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server, {
    //for not having errors in browser console
    cors: {
        origin: '*',
      }
});

//this will be used to show if user is active or not
const { User } = require('./helpers/UserClass');

//require the socket.io stream
require('./socket/streams')(io, User, _);
require('./socket/private')(io);

//the router
//Routing defines the way in which the client 
//requests are handled by the application endpoints.
const auth = require('./routes/authRoutes');
//for user posts
const posts = require('./routes/postRoutes');
//for users routes
const users = require('./routes/userRoutes');
//for friends routes -> follow, unfollow
const friends = require('./routes/friendsRoutes');
//for the chat
const message = require('./routes/messageRoutes');
//add the route for the images
const image = require('./routes/imageRoutes');

//instead of using body-parser we will use the express middleware
//in order to be able to upload pictures, node is parsing them
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

//add middleware for cookie and logger
app.use(cookieParser());
//app.use(logger('dev'));

mongoose.Promise = global.Promise;

//connect to database ---> module made from DB folder 
const connectDB = require('./database/connection');
connectDB();

//MIDDLEWARES
//every url will have '/api/phoenix'
app.use('/api/phoenix', auth);
app.use('/api/phoenix', posts);
app.use('/api/phoenix', users);
app.use('/api/phoenix', friends);
app.use('/api/phoenix', message);
app.use('/api/phoenix', image);

//start the server
server.listen(3000, () => {
    console.log("Listen to 3000");
});