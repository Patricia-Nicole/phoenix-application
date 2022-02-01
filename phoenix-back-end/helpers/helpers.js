const User = require('../models/user');

module.exports = {
    firstUpper: username => {
        //converts username to lowecase
        const name = username.toLowerCase();
        //converts username's first character to uppercase
        //and concatenate to all the other characters
        return name.charAt(0).toUpperCase() + name.slice(1);
      },
      lowerCase: str => {
          //this will convert the email to lowercase
        return str.toLowerCase();
      },
      //update the chatList for user1 and user2
      //also in order to be possible to show the last
      //message notication as the first one
      //delete the receiver and then push it back
      updateChatList: async (req, message) => {
        await User.update(
          {
            //find the document by the user id
            _id: req.user._id
          },
          {
            //check the chatList array, find the receiverId and pull it out(delete it) from the array
            $pull: {
              chatList: {
                receiverId: req.params.receiver_Id
              }
            }
          }
        );
    
        await User.update(
          {
            //find the document by the receiver id
            _id: req.params.receiver_Id
          },
          {
            //check the chatList array, find the receiverId and pull it out(delete it) from the array
            $pull: {
              chatList: {
                receiverId: req.user._id
              }
            }
          }
        );
    
        await User.update(
          {
            _id: req.user._id
          },
          {
            //push into chatList
            $push: {
              chatList: {
                //we use each operator because we want to use position operator
                $each: [
                  {
                    //push the 2 values
                    receiverId: req.params.receiver_Id,
                    msgId: message._id
                  }
                ],
                //the new value in the array will take the position 0
                $position: 0
              }
            }
          }
        );
    
        await User.update(
          {
            _id: req.params.receiver_Id
          },
          {
            $push: {
              chatList: {
                //we use each operator because we want to use position operator
                $each: [
                  {
                    //push the 2 values
                    receiverId: req.user._id,
                    msgId: message._id
                  }
                ],
                //the new value in the array will take the position 0
                $position: 0
              }
            }
          }
        );
      }
}