const express = require('express');
//for allowing us to create routes by calling the router method
const router = express.Router();

const PostController = require('../controllers/posts');
const AuthHelper = require('../helpers/AuthHelper');

//for ever router we create we add the verified token
router.get('/posts', AuthHelper.VerifyToken, PostController.GetAllPosts);
//in order to display the comments on the comment page as the user adds them
router.get('/post/:id', AuthHelper.VerifyToken, PostController.GetPost);

//on each router we will verify the token
//if token not available, then return the error message
//otherwise we will have access to req.body(user info - user object)
router.post('/post/add-post', AuthHelper.VerifyToken, PostController.AddPost);

//for adding the likes
router.post('/post/add-like', AuthHelper.VerifyToken, PostController.AddLike);

//for adding the comments
router.post('/post/add-comment', AuthHelper.VerifyToken, PostController.AddComment);

//for editing a post
//we use http put method in front-end(services/post.service.ts)
router.put('/post/edit-post', AuthHelper.VerifyToken, PostController.EditPost);

//for deleting a post
//we use http delete method in front-end(services/post.service.ts)
router.delete('/post/delete-post/:id', AuthHelper.VerifyToken, PostController.DeletePost);

module.exports = router;