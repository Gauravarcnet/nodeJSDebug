const fs = require('fs');
const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http);
app.use(express.static(__dirname));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended : false}));
const mongoose = require('mongoose');
mongoose.Promise = Promise;
var dbUrl = 'mongodb://localhost:27017/learning';
var Message = mongoose.model('Message',{
  name:String,
  message:String
})
var messages=[

];

app.get('/messages',(req,res)=>{
  res.send(messages);
})
app.post('/messages',async (req,res)=>{

  try {
    throw 'some error'

    var message = new Message(req.body)

    var savedMessage = await message.save();

    console.log("saved");

    var censored = await Message.findOne({message:'gaurav'})

    if (censored)
      await Message.remove({_id:censored.id})

    else
      io.emit('message',req.body);

    res.sendStatus(200);
  } catch (error) {
    res.sendStatus(500);
    return console.error(error);

  }

})

io.on('connection',(socket)=>{
  console.log("New User Connected");
})
mongoose.connect(dbUrl,{ useNewUrlParser: true },(err)=>{
  console.log("connected database");
})

http.listen(8050);
