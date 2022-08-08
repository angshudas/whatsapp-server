const User = require('../model/User');
const jwt = require('jsonwebtoken');

const refresh = async(req,res)=>{
  const refreshToken = req.cookies['whatsappjwt'];
  // return res.status(200);
  // console.log(refreshToken,'hello');
  if( !refreshToken )
    return res.status(403).json({ msg : 'whatsapp refresh token not found' });

  const user = await User.findOne({ refreshToken }).exec();
  // console.log(user);
  if( !user )
    return res.status(403).json({ msg : 'refresh token invalid' });

  jwt.verify(
    refreshToken,
    process.env.REFRESH_TOKEN_SECRET,
    (err,decoded)=>{
      // console.log(decoded,user.email,'decoded');
      // console.log(err,'err');
      if( err )
        return res.status(403).json({ msg : 'refresh token invalid' });
      
      if( decoded.email!==user.email )
        return res.status(403).json({ msg : 'email not matched' });
      
      const accessToken = jwt.sign(
        { 'email' : user.email },
        process.env.ACCESS_TOKEN_SECRET,
        { expiresIn : '1d' }
      );

      return res.status(200).json({
         _id : user._id,
         accessToken,
         email : user.email,
         username : user.username,
         userimg : user.userimg,
      });
    }
  )
  
}


module.exports = {
  refresh,
};