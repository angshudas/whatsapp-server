const express = require('express');
const app = express();
const http = require('http').Server(app);
const User = require('./model/User');
const io = require('socket.io')(http,{
  cors : {
    origin : ['http://127.0.0.1:3000']
  }
});
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
require('dotenv').config();
const cors = require('cors');

const PORT = 3500;
mongoose.connect('mongodb://localhost:27017/whatsapp',function(){
  console.log('connected to db');
});


app.use(cookieParser());
app.use(express.urlencoded({extended:false}));
app.use(express.json());
app.use(cors({ origin : 'http://127.0.0.1:3000',credentials : true }));
io.on('connection',require('./socketServer'));

/****************** Routing ********************* */
app.use('/user',require('./routes/User'));
app.use('/auth',require('./routes/Auth'));
app.use('/chat',require('./routes/Chat'));
app.use('/room',require('./routes/Room'));
/****************** Routing ********************* */


mongoose.connection.once('open',()=>{
  http.listen(PORT,()=>{
    console.log(`listening to port : ${PORT}`);
  });
});
