const mongoose = require('mongoose');

const ConversationSchema = mongoose.Schema({
//an array with the 2 participants at the conversation 
//-> the one who sends the messages senderId
//-> and the one who receives the messages receiverId
//when the users chat for first time, we add their ids to this collection
//if they already have a conversation, we check if the 2 ids are in the collection
  participants: [
    {
      senderId: { type: mongoose.Schema.Types.ObjectId },
      receiverId: { type: mongoose.Schema.Types.ObjectId }
    }
  ]
});

module.exports = mongoose.model('Converation', ConversationSchema);