//joi = Object Based Schema Validator
//joi is used in order to validate date before it is added to the schema
const Joi = require('joi');
//check status of pages
const HttpStatus = require('http-status-codes');
const Post = require('../models/postModels');
const User = require('../models/user');
const cloudinary = require('cloudinary');
//in order to display the posts of last 24h
const moment = require('moment');
//in order to use the location
const request = require('request');

cloudinary.config({
  cloud_name: 'doztrdady',
  api_key: '783399861946491',
  api_secret: 'DR_G-vVqD74gQjbnLUQpFNd1MT0'
});

//post data into the database 
module.exports = {
    AddPost(req, res) {
        const schema = Joi.object().keys({
            //validate the post, not also the image field
            //user can add or not an image
            post: Joi.string().required()
        });

        //create another object
        const body = {
          post: req.body.post
        };

        //if an error accurs then send the message to 
        //the database
        //this validate method is going to validate the body object from above
        const { error } = schema.validate(body);
        if (error && error.details) {
          return res.status(HttpStatus.BAD_REQUEST).json({ msg: error.details });
        }

        //create a new object called body and get user properties
        const bodyObj = {
          user: req.user._id,
          username: req.user.username,
          post: req.body.post,
          created: new Date(),
          picVersion: req.user.picVersion,
          picId: req.user.picId,
          city: req.user.city,
          country: req.user.country
        };
        
        //if there is a text post, but not image post
        if (req.body.post && !req.body.image) {
          Post.create(bodyObj) .then(async post => {
            //get document of the user that created the new post
            //and update the posts
            await User.update(
              {
                _id: req.user._id
              },
              {
                //push into post array
                $push: {
                  posts: {
                    postId: post._id,
                    post: req.body.post,
                    created: new Date(),
                    picVersion: req.body.picVersion,
                    picId: req.body.picId,
                    city: req.user.city,
                    country: req.user.country
                  }
                }
            }
            );
            res.status(HttpStatus.OK).json({ message: 'Post created', post });
            }).catch(err => {
            res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ message: 'Error occured at posts' });
          });
        }

        //if there is also a picture we want to upload
        if (req.body.post && req.body.image) {
          cloudinary.uploader.upload(req.body.image, async result => {
            const reqBody = {
              user: req.user._id,
              username: req.user.username,
              post: req.body.post,
              imgId: result.public_id,
              imgVersion: result.version,
              created: new Date(),
              picVersion: req.user.picVersion,
              picId: req.user.picId,
              city: req.user.city,
              country: req.user.country
            };
            Post.create(reqBody)
              .then(async post => {
                await User.update(
                  {
                    _id: req.user._id
                  },
                  {
                    $push: {
                      posts: {
                        postId: post._id,
                        post: req.body.post,
                        created: new Date(),
                        picVersion: req.body.picVersion,
                        picId: req.body.picId,
                        city: req.user.city,
                        country: req.user.country
                      }
                    }
                  }
                );
                res.status(HttpStatus.OK).json({ message: 'Post created', post });
              })
              .catch(err => {
                res
                  .status(HttpStatus.INTERNAL_SERVER_ERROR)
                  .json({ message: 'Error occured at creating the post' });
              });
          });
        }
        
    },

    //get the posts from user
    async GetAllPosts(req, res) {
        try {
            //in streams display just the last 24 h posts
            //moment(imported up) has a method called startOf()
            //start counting the time in that particulat day
            const today = moment().startOf('day');
            //add time -> one day
            const tomorrow = moment(today).add(1, 'days');

            //this is for all stream posts
            const posts = await Post.find({
              //$gte = greather than
              //$lt = less than
              //show just the last 24h posts
              //created: { $gte: today.toDate(), $lt: tomorrow.toDate() }
            })
            //we can use this due to user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
            //which we have in postModels.js
            .populate('User')
            //search posts from latest to oldest
            .sort({ created: -1 });

            //this is for top stream posts, which are the posts 
            //that have the total likes
            //gte = greather than or equal to 
            const top = await Post.find({  
              totalLikes: { $gte: 100 },
              //created: { $gte: today.toDate(), $lt: tomorrow.toDate() }
            })
            .populate('User')
            .sort({ created: -1 });

            //get location
            const user = await User.findOne({ _id: req.user._id });
            //if the fields are empty for city and country
            if (user.city === '' && user.country === '') {
              request(
                'https://geoip-db.com/json/',
                { json: true },
                async (err, res, body) => {
                  //console.log(body); -> {
                        //country_code: 'RO',     
                        //country_name: 'Romania',
                        //city: null,...}
                  await User.update(
                    {
                      _id: req.user._id
                    },
                    {
                      city: body.city,
                      country: body.country_name
                    }
                  );
                }
              );
            }

            return res.status(HttpStatus.OK).json({ message: 'All posts', posts, top });
        } catch (err) {
            return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ message: 'Error occured here' });
        }
    },

    //once a user clicks to the like button, 
    //then the postModels.js will be updated
    async AddLike(req, res) {
        //the post id
        const postId = req.body._id;
        await Post.update({
            //find the post by id
            _id: postId,
            //make sure that the user who added the like doesn't 
            //already exists
            //$ne = not equal
            'likes.username': { $ne: req.user.username }
        }, {
            //update the likes array
            $push: {
                likes: {
                //the user who added the like to the post
                  username: req.user.username
                }
            },
            //the increment method to increment total likes by 1
            $inc: { totalLikes: 1 }
        }).then(() => {
            res.status(HttpStatus.OK).json({ message: 'You liked the post' });
          })
          .catch(err =>
            res
              .status(HttpStatus.INTERNAL_SERVER_ERROR)
              .json({ message: 'Error occured' })
          );
    },

    //once a user clicks to the add comment button, 
    //then the postModels.js will be updated
    async AddComment(req, res) {
        //console.log(req.body);
        //the post id
        const postId = req.body.postId;
        await Post.update({
            //find the post by id in order to update it
            _id: postId
        }, {
             //update the comments array
            $push: {
              comments: {
                //the user who added the comment to the post
                userId: req.user._id,
                username: req.user.username,
                comment: req.body.comment,
                createdAt: new Date(),
                picVersion: req.user.picVersion,
                picId: req.user.picId
              }
            }
        }).then(() => {
            res.status(HttpStatus.OK).json({ message: 'Comment added to post' });
          })
          .catch(err =>
            res
              .status(HttpStatus.INTERNAL_SERVER_ERROR)
              .json({ message: 'Error occured' })
          );
    },

    async GetPost(req, res) {
        //to get just one single post by its id
        await Post.findOne({ _id: req.params.id })
          .populate('User')
          //from models/postModels.js we use the userId from comments
          //but the userId has the reference as User
          .populate('comments.User')
          .then(post => {
            res.status(HttpStatus.OK).json({ message: 'Post found', post });
          })
          .catch(err =>
            res
              .status(HttpStatus.NOT_FOUND)
              .json({ message: 'Post not found'})
          );
    },

    EditPost(req, res) {
      //console.log(req.body); -> { id: '6114e0a29ea51e275c1106ea', post: 'hello' }
      const schema = Joi.object().keys({
            //validate the post
            post: Joi.string().required(),
            //the id is an optional field
            id: Joi.string().optional()
      });

      //if an error accurs then send the message to 
      //the database
      //this validate method is going to validate the body object from above
      const { error } = schema.validate(req.body);
      if (error && error.details) {
        return res.status(HttpStatus.BAD_REQUEST).json({ msg: error.details });
      }
   
      //create a new object
      const body = {
        //pass the post and created property
        post: req.body.post,
        created: new Date()
      };

      //already have Post defined above
      //find object by id, want to update the above body
      //because we want to send the new object we add: { new: true }
      Post.findOneAndUpdate({ _id: req.body.id }, body, { new: true })
        .then(post => {
          res
            .status(HttpStatus.OK)
            .json({ message: 'Post updated successfully', post });
        })
        .catch(err => {
          return res
            .status(HttpStatus.INTERNAL_SERVER_ERROR)
            .json({ message: err });
        });
    },

    async DeletePost(req, res) {
      //we want to delete the post from post collection, but also from
      //the post array -> otherwise postId which is not in posts collection
      //will throw an error
      try {
        //use destructuring -> from req.params, we get the id
        const { id } = req.params;
        //find the id of the post
        const result = await Post.findByIdAndRemove(id);
        //this console.log will return the object that has been deleted
        console.log(result);
        //if there is not found the post that has to be deleted
        if (!result) {
          return res
            .status(HttpStatus.NOT_FOUND)
            .json({ message: 'Could not delete post' });
        } else {
          //if there has been deleted a post
          //update the user
          await User.update(
            {
              //find user document by its id
              _id: req.user._id
            },
            {
              //get out the post -> remove from the database the post
              $pull: {
                posts: {
                  postId: result._id
                }
              }
            }
          );
          return res
            .status(HttpStatus.OK)
            .json({ message: 'Post deleted successfully' });
        }
      } catch (err) {
        return res
          .status(HttpStatus.INTERNAL_SERVER_ERROR)
          .json({ message: err });
      }
    }
};