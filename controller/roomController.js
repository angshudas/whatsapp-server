const Chat = require('../model/Chat');

const getDetails = async (req,res)=>{
  let roomId = req.headers['room_id'];
  // console.log(roomId);
  if( !roomId ) 
    return res.status(403).json({ msg : 'room id required' });

  let chat = await Chat.findOne({ _id : roomId })
            .populate({ path : 'members', select : 'username' });

  if( !chat )
    return res.status(403).json({ msg : 'invalid room id' });

  // console.log(chat);

  return res.status(200).json(chat);
}

module.exports = {
  getDetails
}