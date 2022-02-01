const HttpStatus = require('http-status-codes');

const Message = require('../models/messageModels');
const Conversation = require('../models/conversationModels');
const User = require('../models/user');
const Helper = require('../Helpers/helpers');

module.exports = {

    //get all messages from both users
    async GetAllMessages(req, res) {
        //use the conversation id to find both users' message documents
        const { sender_Id, receiver_Id } = req.params;
        const conversation = await Conversation.findOne({
            //or operator with 2 objects
            $or: [
            {
            //use and operator, which takes an array with an object
            //check if id of user1 = sender_Id and id of user2 = receiver_id
              $and: [
                { 'participants.senderId': sender_Id },
                { 'participants.receiverId': receiver_Id }
              ]
            },//OR
            {
            //check if id of user2 = sender_Id and id of user1 = receiver_id
                $and: [
                { 'participants.senderId': receiver_Id },
                { 'participants.receiverId': sender_Id }
              ]
            }
          ] //we do not want the whole document, just the id
          //-> so we use the select method to get the particular field from result
        }).select('_id');
        //if the result exists
        if (conversation) {
          const messages = await Message.findOne({
            //find the message by its id
            conversationId: conversation._id
          });
          res
            .status(HttpStatus.OK)
            .json({ message: 'Messages returned', messages });
        }
    },

    SendMessage(req, res) {
        //console.log(req.body);
        const { sender_Id, receiver_Id } = req.params;
        Conversation.find(
            {
            //if both of the following coditions hold, then the 
            //users started the conversation already
              $or: [
                {
                //if senderId and receiverId from here are same as the ones 
                //from models/conversationModels.js
                  participants: {
                    $elemMatch: { senderId: sender_Id, receiverId: receiver_Id }
                  }
                },
                {
                  participants: {
                    $elemMatch: { senderId: receiver_Id, receiverId: sender_Id }
                  }
                }
              ]
        }, async(err, result) => {

            if(result.length > 0) {
              //find the document using the conversationId
              const msg = await Message.findOne({ conversationId: result[0]._id });
              //call the method updateChatList() from controllers/message.js
              //so from the message we get the id
              Helper.updateChatList(req, msg);
                //if the 2 users already started a conversation
                await Message.updateMany(
                {
                    //want to find the message document using the conversation id
                    conversationId: result[0]._id
                },
                //update the message array
                {
                $push: {
                    message: {
                        senderId: req.user._id,
                        receiverId: req.params.receiver_Id,
                        sendername: req.user.username,
                        receivername: req.body.receiverName,
                        body: req.body.message
                    }
                }
                })
                .then(() =>
                    res
                    .status(HttpStatus.OK)
                    .json({ message: 'Message sent successfully' })
                )
                .catch(err =>
                    res
                    .status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .json({ message: 'Error occured at sending the messages' })
                );

            }
            //if the user wants to start a new conversation 
            else {
                //create a new instance of this conversation -> new participants
                const newConversation = new Conversation();
                //in participants array we add the following
                newConversation.participants.push({
                    //get user id
                    senderId: req.user._id,
                    receiverId: req.params.receiver_Id
                });
                //save the value in an array
                //we can use await as we are inside the async callback
                const saveConversation = await newConversation.save();
                //console.log(saveConversation);

                //create new message
                const newMessage = new Message();
                //the following 3 are the ones we get from saveConversation
                //get conversation id and add it into the document
                newMessage.conversationId = saveConversation._id;
                newMessage.sender = req.user.username;
                newMessage.receiver = req.body.receiverName;
                //push into the message array the following
                //fields from models/messageModels.js
                newMessage.message.push({
                    senderId: req.user._id,
                    receiverId: req.params.receiver_Id,
                    sendername: req.user.username,
                    receivername: req.body.receiverName,
                    //body of the message
                    body: req.body.message
                });

                //UPDATE CHATLIST FOR USER 1
                //THIS IS FOR THE DOCUMENT OF THE SENDER -> USER 1
                await User.updateOne(
                    {
                    //find document by id
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
                              msgId: newMessage._id
                            }
                          ],
                          //the new value in the array will take the position 0
                          $position: 0
                        }
                      }
                    }
                );

                //UPDATE CHATLIST FOR USER 2
                //THIS IS FOR THE DOCUMENT OF THE RECEIVER -> USER 2
                await User.updateMany(
                    {
                      _id: req.params.receiver_Id
                    },
                    {
                      $push: {
                        chatList: {
                          $each: [
                            {
                              receiverId: req.user._id,
                              msgId: newMessage._id
                            }
                          ],
                          $position: 0
                        }
                      }
                    }
                );

                await newMessage
                    .save()
                    .then(() => res.status(HttpStatus.OK).json({ message: 'Message sent' }))
                    .catch(err => res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ message: 'Error at message sent' }))
            }
        });     
    },

    async MarkReceiverMessages(req, res) {
      //console.log(req.params);
      //get the sender and receiver of the messages
      const { sender, receiver } = req.params; 
      //Aggregation method operations process data 
      //records and return computed results. 
      //Aggregation operations group values from 
      //multiple documents together, and can perform 
      //a variety of operations on the grouped data to 
      //return a single result.
      //it takes an array
      const msg = await Message.aggregate([
        //$unwind operator destructures an array
        //unwind the message array to show instead of object
        //what it is inside of the object
        { $unwind: '$message' },
        {
          $match: {
            //and operator takes an array with an object
            $and: [
              { 'message.sendername': receiver, 'message.receivername': sender }
            ]
          }
        }
      ]);

      //console.log(msg);
      //now we have to look through the array and mark the messages
      //if we have values inside the array, we want to mark them
      if (msg.length > 0) {
        try {
          //msg is an array so we loop through it
          msg.forEach(async value => {
            await Message.updateOne(
              {
                //get every document by its id
                'message._id': value.message._id
              },
              //set operator to mark the message as read
              { $set: { 'message.$.isRead': true } }
            );
          });
          res.status(HttpStatus.OK).json({ message: 'Messages maked as read' });
        } catch (err) {
          res
            .status(HttpStatus.INTERNAL_SERVER_ERROR)
            .json({ message: 'Error occured at marking one message' });
        }
      }
    },

    async AllMessagesMarked(req, res) {
      const msg = await Message.aggregate([
        //when we get the data by finding a match
        { $match: { 'message.receivername': req.user.username } },
        //we unwind the message array to see what is inside the objects 
        { $unwind: '$message' },
        //pass again to make sure that we get only the required object
        //that we want
        { $match: { 'message.receivername': req.user.username } }
      ]);

      //console.log(msg);
  
      if (msg.length > 0) {
        try {
          msg.forEach(async value => {
            await Message.updateMany(
              {
                'message._id': value.message._id
              },
              { $set: { 'message.$.isRead': true } }
            );
          });
          res
            .status(HttpStatus.OK)
            .json({ message: 'All messages maked as read' });
        } catch (err) {
          res
            .status(HttpStatus.INTERNAL_SERVER_ERROR)
            .json({ message: 'Error occured at marking all messages' });
        }
      }
    }
};