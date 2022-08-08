const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
  message : 'String',
  sender : {
    type : 'String',
    required : true,
  },
  time : {
    type : Date,
    default : ()=> Date.now(),
  }
});

const chatSchema = new mongoose.Schema({
  members : {
    type : [mongoose.Types.ObjectId],
    default : [],
    ref : 'User',
  },
  messages : {
    type : [messageSchema],
    default : [],
  }
}); 

module.exports = mongoose.model('Chat',chatSchema);