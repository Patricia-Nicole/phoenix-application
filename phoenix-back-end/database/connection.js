const mongoose = require('mongoose');

//connect to the database MONGODB
const MongoClient = require('mongodb').MongoClient;
const URI = require('../config/secret');

const connectDB = async () => {
	await mongoose.connect(URI.url, 
        { 
            //to not show the errors in terminal
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useCreateIndex: true
        });
    console.log('database has been connected');
}

module.exports = connectDB;