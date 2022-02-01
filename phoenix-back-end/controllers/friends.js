const User = require('../models/user');
const HttpStatus = require('http-status-codes');

module.exports = {
    FollowUser(req, res) {
        //instead of using async FollowUser() we create an async method
        const followUser = async () => {
            //update the following fields
            await User.update({
                //find the document of the user that wants to follow another user
                _id: req.user._id,
                //check if the user that wants to be followed does not already exists
                //inside the following array by using not equal method ($ne)
                'following.userFollowed': { $ne: req.body.userFollowed }
            }, {
                //to the following array we push the array
                $push: {
                    following: {
                      userFollowed: req.body.userFollowed
                    }
                }
            });

            //update for the other user that has been followed
            await User.update({
                //find the document of the user that has been followed
                _id: req.body.userFollowed,
                //check if the user that has been followed does not already exists
                //inside the following array by using not equal method ($ne)
                'following.follower': { $ne: req.user._id }
            }, {
                $push: {
                    followers: {
                      follower: req.user._id
                    },
                    //when user is followed by another user, he/she will be notified
                    notifications: {
                      senderId: req.user._id,
                      message: `${req.user.username} is now following you.`,
                      created: new Date(),
                      viewProfile: false
                    }
                }
            });
        };

        followUser()
            .then(() => {
                res.status(HttpStatus.OK).json({ message: 'Following user now' })
            })
            .catch(err => {
                res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ message: 'Error at following user occured' })
            });
    },

    UnFollowUser(req, res) {
        const unFollowUser = async () => {
          await User.update(
            {
              _id: req.user._id
            },
            {
            //take out the particular user2 from the following array
            //from user1 account
              $pull: {
                following: {
                  userFollowed: req.body.userFollowed
                }
              }
            }
          );
    
          await User.update(
            {
              _id: req.body.userFollowed
            },
            {
            //take out the same particular user1 from the followers array
            //from user 2 account
              $pull: {
                followers: {
                  follower: req.user._id
                }
              }
            }
          );
        };
    
        unFollowUser()
          .then(() => {
            res.status(HttpStatus.OK).json({ message: 'FUnfllowing user now' });
          })
          .catch(err => {
            res
              .status(HttpStatus.INTERNAL_SERVER_ERROR)
              .json({ message: 'Error occured' });
          });
    },

    async MarkNotification(req, res) {
      if (!req.body.deleteValue) {
        await User.updateOne(
          {
            //get user id and notification id
            _id: req.user._id,
            'notifications._id': req.params.id
          },
          {
            //set inside the notifications array
            //and the field we want to update is read and set it to true
            $set: { 'notifications.$.read': true }
          }
        )
          .then(() => {
            res.status(HttpStatus.OK).json({ message: 'Marked as read' });
          })
          .catch(err => {
            res
              .status(HttpStatus.INTERNAL_SERVER_ERROR)
              .json({ message: 'Error occured at marking the notification' });
          });
      } else {
        await User.update(
          {
            //get id of the document and check the array if the id exists
            _id: req.user._id,
            'notifications._id': req.params.id
          },
          {
            //if we find it, then we delete the specific notification
            //from the array
            $pull: {
              notifications: { _id: req.params.id }
            }
          }
        )
          .then(() => {
            res.status(HttpStatus.OK).json({ message: 'Deleted successfully' });
          })
          .catch(err => {
            res
              .status(HttpStatus.INTERNAL_SERVER_ERROR)
              .json({ message: 'Error occured at deleting the notification' });
          });
      }
    },
  
    async MarkAllNotifications(req, res) {
      await User.update(
        {
          _id: req.user._id
        },
        { $set: { 'notifications.$[elem].read': true } },
        { arrayFilters: [{ 'elem.read': false }], multi: true }
      )
        .then(() => {
          res.status(HttpStatus.OK).json({ message: 'Marked all successfully' });
        })
        .catch(err => {
          res
            .status(HttpStatus.INTERNAL_SERVER_ERROR)
            .json({ message: 'Error occured' });
        });
    }, 

    //for marking the notifications in the dropdown in the toolbar
    async MarkAllNotifications(req, res) {
      await User.update(
        {
          //find document we want to update
          _id: req.user._id
        },
        //elem is just a variable
        { $set: { 'notifications.$[elem].read': true } },
        //use arrayFilters method, which is specific to MongoDB
        //look through the array, for every elem where the read property is set to false
        //all elem we find as false, we set them as true
        { arrayFilters: [{ 'elem.read': false }], multi: true }
      )
        .then(() => {
          res.status(HttpStatus.OK).json({ message: 'Marked all successfully' });
        })
        .catch(err => {
          res
            .status(HttpStatus.INTERNAL_SERVER_ERROR)
            .json({ message: 'Error occured at marking the read elem' });
        });
    }

};