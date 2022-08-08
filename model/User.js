const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  username : {
    type : 'String',
    required : true,
    unique : true,
  },
  email : {
    type : 'String',
    required : true,
    unique : true,
    validate : {
      validator : (email)=>{
        if (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email))
          return true;
        
        return false;
        
      },
      message : (props)=>{
        return 'invalid email format';
      }
    },
  },
  password : {
    type : 'String',
    required : true,
  },
  refreshToken : {
    type : 'String',
    default : '',
  },
  joinedChats : {
    type : [mongoose.Types.ObjectId],
    default : [],
    ref : 'Chat',
  },
  waitingChats : {
    type : [mongoose.Types.ObjectId],
    default : [],
    ref : 'Chat',
  },
  blockedChats : {
    type : [mongoose.Types.ObjectId],
    default : [],
    ref : 'Chat',
  },
  userimg : {
    type : 'String',
    default : '',
  }

});


module.exports = mongoose.model('User',userSchema);