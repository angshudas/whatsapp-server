const Chat = require('./model/Chat');
const User = require('./model/User');

const socketServer = async (socket)=>{
  let currentChat;
  let user;
  socket.room = '';
  console.log(socket.id);
  
  socket.on('setEmail',async (email)=>{
    // console.log(email);
    user = await User.findOne({email}).exec();
    console.log(user.email);
  })
  socket.on('setChat',async (chat_id)=>{
    // console.log(chat_id);
    if( socket.room!=='' )
      socket.leave(socket.room);
    socket.room = chat_id
    socket.join(chat_id);
    currentChat = await Chat.findOne({_id : chat_id});
    console.log(currentChat._id,'here');
  })

  socket.on('sendMessage',async(message)=>{
    console.log(message);
    const newMessage = {
      message,
      sender : user.username,
    }
    currentChat.messages.push(newMessage);
    socket.to(socket.room).emit('receiveMessage',message);
    await currentChat.save();
  })

}

module.exports = socketServer;