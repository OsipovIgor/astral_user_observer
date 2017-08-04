class RoomHelper {
  getUniqueItems(rooms) {
    return Object.entries(rooms).filter(u => !u[1].sockets[u[0]]).map(n => n[0]);
  }
}

module.exports = new RoomHelper();