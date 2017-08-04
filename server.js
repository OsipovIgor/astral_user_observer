const app = require('express')();
const http = require('http').Server(app);
const io = require('socket.io')(http);
const bodyParser = require('body-parser');

const roomHelper = require('./helpers/RoomHelper');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.get('/', (req, res) => {
  res.sendFile(__dirname + 'public/index.html');
});

app.get('/users', (req, res) => {
  const { rooms } = io.sockets.adapter;

  return res.json(roomHelper.getUniqueItems(rooms).filter(entity => entity.length !== 36));
});

app.get('/abonents', (req, res) => {
  const { rooms } = io.sockets.adapter;

  return res.json(roomHelper.getUniqueItems(rooms).filter(entity => entity.length === 36));
});

app.post('/send_users', (req, res) => {
  const { username, message } = req.body;

  if (!username) {
    res.statusCode = 500;
    return res.send("Не указан username ");
  }
    
  io.to(username).emit("message", message);
  return res.sendStatus(200);
});

app.post('/send_abonents', (req, res) => {
  const { abonentGuid, message } = req.body;

  if (!abonentGuid) {
    res.statusCode = 500;
    return res.send("Не указан abonentGuid");
  }

  io.to(abonentGuid).emit("message", message);
  return res.sendStatus(200);
});

io.on('connection', function(socket) {
  const { username, abonentGuid } = socket.handshake.query;

  if (username)
    socket.join(username);
  if (abonentGuid)
    socket.join(abonentGuid);
});

http.listen(3228, function(){
  console.log('listening on *:3228');
});