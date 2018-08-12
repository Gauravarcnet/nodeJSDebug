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
app.post('/messages',(req,res)=>{
  var message = new Message(req.body)
  message.save((err)=>{
    if(err)
      sendStatus(500)


      messages.push(req.body);
      io.emit('message',req.body);
      res.sendStatus(200);
  })

})
io.on('connection',(socket)=>{
  console.log("New User Connected");
})
mongoose.connect(dbUrl,{ useNewUrlParser: true },(err)=>{
  console.log("connected database");
})

http.listen(8050);
