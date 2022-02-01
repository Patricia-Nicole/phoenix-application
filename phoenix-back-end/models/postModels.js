const mongoose = require('mongoose');

const postSchema = mongoose.Schema({
    //save id of the user and make reference to User collection
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    //save the username as well
    username: { type: String, default: '' },
    post: { type: String, default: '' },
    //these will be used in controllers/posts.js at creating the 
    //post with the image as well
    imgVersion: { type: String, default: '' },
    imgId: { type: String, default: '' },
    //the comments will be an array
    //each comment will contain the following 
    comments: [
        {
            userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
            username: { type: String, default: '' },
            comment: { type: String, default: '' },
            createdAt: { type: Date, default: Date.now() },
            //get these from CLOUDINARY
            picVersion: { type: String, default: '1628238923' },
            //default image of the users and when they upload this will change
            picId: { type: String, default: 'avatar_qpq9es.png' }
        }
    ],
    //total likes for each comment
    totalLikes: { type: Number, default: 0 },
    //likes will be as type array
    likes: [
        {
            username: { type: String, default: '' }
        }
    ],
    created: { type: Date, default: Date.now() },
    //get these from CLOUDINARY
	picVersion: { type: String, default: '1628238923' },
	//default image of the users and when they upload this will change
	picId: { type: String, default: 'avatar_qpq9es.png' },
    city: { type: String, default: '' },
	country: { type: String, default: '' }
});

module.exports = mongoose.model('Post', postSchema);