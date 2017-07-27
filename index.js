
var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);

app.get('/', function(req, res){
  res.sendFile(__dirname + '/index.html');
});

var users = [];

io.on('connection', function(socket){
  
  var username = socket.handshake.query.username;
  
  if(users.indexOf(username) === -1)
    users.push(socket.handshake.query.username);

  console.log("users", users);
  socket.on('disconnect', function() {
    console.log("disconnected");
  });
});

http.listen(3228, function(){
  console.log('listening on *:3228');
});