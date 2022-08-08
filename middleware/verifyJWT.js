const jwt = require('jsonwebtoken');
const User = require('../model/User');

const verifyJWT = (req,res,next)=>{
  let accessToken = req.headers['authorization'];
  if( !accessToken )
    return res.status(403).json({ msg : 'unauthorized access jwt' });

  accessToken = accessToken.split(' ')[1];
  
  jwt.verify(
    accessToken,
    process.env.ACCESS_TOKEN_SECRET,
    async (err,decoded)=>{
      if( err ) 
        return res.status(403).json({ msg : err });
      
      const found = await User.find({ email : decoded.email }).exec();
      if( !found )
        return res.status(403).json({ msg : 'user not found' });

      req.headers['email'] = decoded.email;

      next();
    }
  );
}

module.exports = verifyJWT;