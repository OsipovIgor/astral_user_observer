const { UserManager } = require("./managers/UserManager");

var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});

io.on('connection', function(socket) {
  const username = socket.handshake.query.username;
  UserManager.connect(socket.id, username);

  socket.on('disconnect', function() {
    UserManager.disconnect(socket.id);
  });
});

http.listen(3228, function(){
  console.log('listening on *:3228');
});