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
    this.service.logger.info('SocketIO listening on: ' + socketioConfig.ip + ':'+ socketioConfig.port);
    this.namespaces = {
      multiplayer: new SocketIoMultiplayerNamespace(
        this.service, this.io
      )
    };
  }

  emit(namespace, socketioRoomId, eventName, data) {
    this.namespaces[namespace].emit(socketioRoomId,eventName, data);
  }

  disconnectClient(namespace, socketId) {
    this.namespaces[namespace].disconnectClient(socketId);
  }

}

const socketIoManager = new SocketIoManager();
module.exports = { socketIoManager };