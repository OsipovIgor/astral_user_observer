const { UserManager } = require("./managers/UserManager");

var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var bodyParser = require('body-parser');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});

app.get('/users', (req, res) => {
  return res.json(UserManager.getUsers());
});

io.on('connection', function(socket) {
  const username = socket.handshake.query.username;
  UserManager.connect(socket.id, username);

  app.post('/send', (req, res) => {
    const { message } = req.body;
    
    io.local.emit("message", message);
    return res.sendStatus(200);
  });

  socket.on('disconnect', function() {
    UserManager.disconnect(socket.id);
  });
});

http.listen(3228, function(){
  console.log('listening on *:3228');
});