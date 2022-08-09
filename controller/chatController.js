const User = require('../model/User');
const Chat = require('../model/Chat');


const allChats = async( req,res )=>{
  const email = req.headers['email'];

  if( !email )
    return res.status(403).json({ msg : 'email not found' });

  const user = await User.findOne({ email }).select('joinedChats groupChats')
  .populate({
    path : 'joinedChats',
    select : 'members',
    populate : { 
      path : 'members',
      match :{ email : { $ne : email } },
      select : 'username userimg -_id' 
    } 
  });

  res.status(200).json({ user });

}

const addNewChat = async(req,res)=>{
  const email = req.headers['email'];
  const { friend } = req.body;

  if( !email || !friend )
    return res.status(403).json({ msg : 'sender and friend email required' });
  
  const senderUser = await User.findOne({ email }).select('joinedChats username');

  if( !senderUser )
    return res.status(403).json({ msg : 'sender user email not valid' });
  const friendUser = await User.findOne({ email : friend }).exec();
  if( !friendUser )
    return res.status(403).json({ msg : 'friend email not valid' });

  // console.log(senderUser);
  let duplicate = false;

  senderUser.joinedChats.forEach(chat=>{
    if( JSON.stringify(chat.members[0])===JSON.stringify(friendUser._id) )
      duplicate = true;
    if( JSON.stringify(chat.members[1])===JSON.stringify(friendUser._id) )
      duplicate = true;
  });

  if( duplicate )
    return res.status(400).json({ msg : 'friend already exists' });

  const chat = await Chat.create({
    members : [senderUser._id,friendUser._id]
  });

  senderUser.joinedChats.push(chat._id);
  await senderUser.save();
  friendUser.joinedChats.push(chat._id);
  await friendUser.save();

  return res.status(200).json({
     _id : chat._id,
     members:[{username : senderUser.username},{username : friendUser.username}] 
  });
}

const joinChat = async( req,res )=>{
  const chat_id = req.params.chat_id;
  const email = req.headers.email;
  
  const {members} = await Chat.findOne({ _id:chat_id }).select('members -_id')
  .populate({ path : 'members',select : 'email -_id' });
  
  const found = members.filter(elem=>elem.email===email);
  
  if( !found )
  return res.status(403).json({ msg : 'not a member of this chat' });
  
  return res.json({ msg : 'chat joined' });
}

module.exports = {
  allChats,
  addNewChat,
  joinChat
}