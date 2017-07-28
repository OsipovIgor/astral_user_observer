
var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);

app.get('/', function(req, res){
  res.sendFile(__dirname + '/index.html');
});

const users = [];

function getCurrentUsers(){
  return users.map(u => u.name);
}

io.on('connection', function(socket) {
  
  const username = socket.handshake.query.username;
  const index = users.findIndex(elem => elem.name === socket.username);

  if (index === -1) {
    users.push({ id: socket.id, name: socket.handshake.query.username });
    console.log("added user");
  }

  console.log("users after connect", getCurrentUsers());

  socket.on('disconnect', function() {
    const index = users.findIndex(elem => elem.id === socket.id);

    if (index !== -1)
      users.splice(index, 1);

    console.log("users after disconect", getCurrentUsers());

  });
});

http.listen(3228, function(){
  console.log('listening on *:3228');
});