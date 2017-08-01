var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var bodyParser = require('body-parser');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.get('/', (req, res) => {
  res.sendFile(__dirname + 'public/index.html');
});

app.get('/users', (req, res) => {
  const { rooms } = io.sockets.adapter;

  return res.json(Object.entries(rooms).filter(u => !u[1].sockets[u[0]]).map(n => n[0]));
});

app.post('/send', (req, res) => {
  const { username, message } = req.body;
  
  if (!username) {
    res.statusCode = 500;
    return res.send("Не указан username");
  }
    
  io.to(username).emit("message", message);
  return res.sendStatus(200);
});

io.on('connection', function(socket) {
  const username = socket.handshake.query.username;

  socket.join(username);
});

http.listen(3228, function(){
  console.log('listening on *:3228');
});