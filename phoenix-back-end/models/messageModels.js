const mongoose = require('mongoose');

const MessageSchema = mongoose.Schema({
//in this schema we have the following fields
//if we have the conversation id we can search for this particular document
  conversationId: { type: mongoose.Schema.Types.ObjectId, ref: 'Conversation' },
  //we add the sender and receiver names
  sender: { type: String },
  receiver: { type: String },
  //the messages will be added in an array
  message: [
    {
      senderId: { type: mongoose.Schema.Types.ObjectId },
      receiverId: { type: mongoose.Schema.Types.ObjectId },
      sendername: { type: String },
      receivername: { type: String },
      body: { type: String, default: '' },
      isRead: { type: Boolean, default: false },
      createdAt: { type: Date, default: Date.now() }
    }
  ]
});

module.exports = mongoose.model('Message', MessageSchema);