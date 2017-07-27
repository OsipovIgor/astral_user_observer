
var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);

app.get('/', function(req, res){
  res.sendFile(__dirname + '/index.html');
});

var users = [];

function getCurrentUsers(){
  return users.map(function(u){ return u.name });
}

io.on('connection', function(socket) {
  
  var username = socket.handshake.query.username;
  var index = users.findIndex(function(elem) {
      return elem.name === socket.username;
    });
  console.log("index", index);
  if (index === -1) {
    users.push({ id: socket.id, name: socket.handshake.query.username });
    console.log("added user");
  }
    

  console.log("users after connect", getCurrentUsers());

  socket.on('disconnect', function() {
    var index = users.findIndex(function(elem) {
      return elem.id === socket.id;
    });

    if (index !== -1)
      users = users.splice(index, 1);

    console.log("users after disconect", getCurrentUsers());

  });
});

http.listen(3228, function(){
  console.log('listening on *:3228');
});