const User = require('../model/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const Chat = require('../model/Chat');

const register = async (req,res)=>{
  const { username,email,password } = req.body;
  if( !username )
    username = '';

  if( !email ) 
    return res.status(409).json({msg : 'username required'});

  if( !password )
    return res.status(409).json({msg : 'email required'});

  try{
    const hashedpwd = await bcrypt.hash(password,10);
    const user = await User.create({username,email,password:hashedpwd});
    return res.status(201).json(user);
  }
  catch(err){
    return res.status(500).json({msg : err});
  }

};

const login = async (req,res)=>{
  const { email,password } = req.body;
  if( !email )
    return res.status(409).json({ msg : 'email required' });
  if( !password )
    return res.status(409).json({ msg : 'password required' });

  let user = await User.findOne({ email }).exec();
  if( !user )
    return res.status(409).json({ msg : 'email not registered' });
  
  let matched = await bcrypt.compare(password,user.password);

  if( !matched )
    return res.status(409).json({ msg : 'password not matched' });

  try{
    
    const refreshToken = jwt.sign(
      { 'email' : user.email },
      process.env.REFRESH_TOKEN_SECRET,
      {expiresIn : '1d' });
    let myDate = new Date();
    myDate.setMonth(myDate.getMonth()+1);

    const accessToken = jwt.sign(
      { 'email' : user.email },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn : '30d' });
    
    user.refreshToken = refreshToken;
    await user.save();

    return res.status(200).cookie('whatsappjwt',`${refreshToken}`,{
        httpOnly : true,
        secure : true,
        sameSite : 'strict',
        maxAge : 1000*60*60*24*30,
      }
    ).json({
      _id : user._id,
      email,
      username:user.username,
      accessToken,
      joinedChats: user.joinedChats,
      waitingChats : user.waitingChats,
      blockedChats : user.blockedChats,
    });

  }
  catch(err){
    return res.status(500).json({ msg : err });
  }
}

const deleteAll = async (req,res)=>{
  await  User.deleteMany({ name : {exists : true} });
  return res.status(200).json({done : true});
}

const updateDetails = async ( req,res )=>{
  const email = req.headers['email'];
  console.log(email);
  const { _email,_username,_userimg } = req.body;
  if( !email )
    return res.status(403).json({ msg : 'email required' });

  let user = await User.findOne({email}).exec();
  if( _email!=='' )
    user.email = _email
  if( _username!=='' )
    user.username = _username;
  if( _userimg!=='' ) 
    user.userimg = _userimg;

  await user.save();

  return res.status(200).json({
    username : user.username,
    userimg : user.userimg,
    email : user.email
  });
}
  

const updatePassword = async (req,res)=>{
  const email = req.headers.email;
  const { newPassword,oldPassword } = req.body;
  console.log(newPassword,oldPassword,email);

  if( !email )
    return res.status(403).json({ msg : 'email not found' });

  if( !newPassword || !oldPassword ) 
    return res.status(403).json({ msg : 'password not sent' });

  let user = await User.findOne({email}).exec();
  let match = bcrypt.compare(oldPassword,user.password);
  if( !match )
    return res.status(403).json({ msg : 'password did not match'  })
  let hashedPass = await bcrypt.hash(newPassword,10);
  
  user.password = hashedPass;
  await user.save();

  return res.status(200).json({ msg : 'Password updated' });

}


module.exports = {
  register,
  login,
  deleteAll,
  updateDetails,
  updatePassword
};