const http = require('http');
const { socketio: socketioConfig } = require('config');
const socketio = require('socket.io');
const {
  SocketIoMultiplayerNamespace
} = require('./multiplayer');

class SocketIoManager {
  initialize(service) {
    this.service = service;
    this.server = http.createServer();
    this.io = socketio(this.server);
    this.server.listen({
      port: socketioConfig.port,
      host: socketioConfig.ip
    });
    this.namespaces = {
      multiplayer: new SocketIoMultiplayerNamespace(
        this.service, this.io
      )
    }
  }

  disconnectClient(namespace, socketId) {
    this.namespaces[namespace].disconnectClient(socketId);
  }

};

const socketIoManager = new SocketIoManager();
module.exports = { socketIoManager };