const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = mongoose.Schema(
    {
        username: { type: String, required: true, unique: true, trim: true },
        email: {
			type: String,
			unique: true,
			required: true,
			trim: true,
			lowercase: true
		},
        password: {
			type: String,
			required: true,
			minlength: 7,
			trim: true,
			validate(value) {
				if (value.toLowerCase().includes('password')) {
					throw new Error('Password cannot contain "password"')
				}
			}
		},
		//add post array to user schema
		posts: [
			{
				postId: { type: mongoose.Schema.Types.ObjectId, ref: 'Post' },
				post: { type: String },
				created: { type: Date, default: Date.now() }
			}
		],
		//the following array
		following: [
			{ 
				//add the userId of the user that is followed
				userFollowed: { type: mongoose.Schema.Types.ObjectId }
			}
		],
		//followers array
		followers: [
			{ 
				//add the userId of the user that is following you
				follower: { type: mongoose.Schema.Types.ObjectId }
			}
		],
		//notifications array
		notifications: [
		  {
			//take the id of the user who did an action 
			//-> e.g. the user who viewed the profile
			senderId: { type: mongoose.Schema.Types.ObjectId },
			//take a message that will be displayed to the user
			message: { type: String },
			viewProfile: { type: Boolean, default: false },
			created: { type: Date, default: Date.now() },
			//notifications from messages
			read: { type: Boolean, default: false },
			//a notification to a user has to be added just once
			//e.g user views the profile 5 times a day, the notification
			//will be sent just once
			//that is why we add this filed and set the date as String
			date: { type: String, default: '' }
		  }
		],
		//an array chatList, inside an object with 2 fields
		chatList: [
			{
			  receiverId: { type: mongoose.Schema.Types.ObjectId },
			  msgId: { type: mongoose.Schema.Types.ObjectId, ref: 'Message' }
			}
		],
		//get these from CLOUDINARY
		picVersion: { type: String, default: '1628238923' },
		//default image of the users and when they upload this will change
		picId: { type: String, default: 'avatar_qpq9es.png' },
		//an array with all images which contains objects
		images: [
		  {
			imgId: { type: String, default: '' },
			imgVersion: { type: String, default: '' }
		  }
		],
		city: { type: String, default: '' },
		country: { type: String, default: '' }
    }
);

//this method can be used outside this file, that's why we use 
//userSchema.statics.EncryptPassword
//password that we want to hash
userSchema.statics.EncryptPassword = async function(password) {
	const hash = await bcrypt.hash(password, 10);
	return hash;
};

module.exports = mongoose.model('User', userSchema)