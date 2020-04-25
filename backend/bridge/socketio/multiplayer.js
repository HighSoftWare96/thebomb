const { socketio: socketioConfig } = require('config');
const events = require('./events');

class SocketIoMultiplayerNamespace {

  constructor(service, ioInstance) {
    this.service = service;

    // qui this.io è un namespace ricavato dall'istanza originale
    this.io = ioInstance.of(
      socketioConfig.namespaces.multiplayer
    );

    this.io.use(
      this._handleClientHandshake.bind(this)
    );

    // connessione di un client
    this.io.on(
      'connection',
      this._handleClientConnection.bind(this)
    );
  }

  async authMiddleware(client, next) {

  }

  async _handleClientHandshake(client, next) {
    const {
      socketioRoom,
      partecipantId
    } = client.handshake.query;

    // disconnessione automatica entro 10 minuti
    const disconnectUser = setTimeout(() => {
      client.disconnect();
    }, 10000);

    try {

      // controllo paramtri connessione
      if (!socketioRoom || !partecipantId) {
        return next(new Error('MISSING_PARAMS'));
      }

      // cerco una stanza corrispondente, non bloccata
      const foundRoom = await this.service.broker.call('room.count', {
        query: { socketioRoom, locked: false }
      });

      if (!foundRoom) {
        return next(new Error('ROOM_NOT_FOUND'));
      }

      // cerco un partecipante con quell'ID e che sia libero
      const foundPartecipants = await this.service.broker.call('partecipant.count', {
        query: {
          id: partecipantId,
          socketId: null
        }
      });

      if (!foundPartecipants) {
        return next(new Error('PARTECIPANT_NOT_FOUND'));
      }

      // evito la disconnessione automatica
      clearTimeout(disconnectUser);
      // ok tutto a posto
      next();

    } catch (e) {
      this.service.logger.error(e);
      return next(new Error('JOINING_ERROR'));
    }
  }

  async _handleClientConnection(client) {
    try {
      const { id: socketId } = client;
      const {
        socketioRoom,
        partecipantId
      } = client.handshake.query;

      // mi salvo il client id di socketio per questo partecipante
      const updatedPartecipant = await this.service.broker.call('partecipant.update', {
        id: partecipantId,
        socketId
      });

      // cerco una stanza corrispondente
      const foundRoom = await this.service.broker.call('room.find', {
        query: { socketioRoom, locked: false }
      });


      // alla disconnessione mi assicuro che il partecipante lasci la stanza
      client.on('disconnect', () => {
        this.service.broker.call('room.leave', {
          id: foundRoom[0].id,
          partecipantId: partecipantId
        })
          .then()
          .catch(e => {
            this.service.logger.error('Client disconnection: unable to leave room.', e);
          });
      });

      // join  socketio room
      client.join(socketioRoom);

      this.service.logger.info(
        'New client connected @'
        + ' PARTECIPANT_ID: ' + partecipantId
        + ' ROOM_ID:' + foundRoom[0].id
        + ' SOCKETIO_ROOM:' + socketioRoom
      );

      // evento di join della stanza
      client.emit(
        events.fromServer.roomJoined,
        {
          room: foundRoom[0],
          partecipant: updatedPartecipant
        });

      // comunico a tutti l'arrivo del nuovo utente
      this.io.to(socketioRoom).emit(
        events.fromServer.newRoomate,
        {
          room: foundRoom[0],
          partecipant: updatedPartecipant
        });

      // mi registro per eventuali eventi dal client
      client.on(events.fromClient.turnCheck, async (payload) => {
        try {
          console.log(payload);
          await this.service.broker.call('round.turnCheck', payload);
        } catch (e) {
          this.service.logger.error(e);
        }
      });

    } catch (e) {
      this.service.logger.error(e);
      this.io.emit(events.fromServer.serverError, e);
    }
  }

  emit(socketioRoomId, eventName, eventData) {
    this.io.to(socketioRoomId).emit(eventName, eventData);
  }

  disconnectClient(socketId) {
    // elimino se non già disconnesso
    if (this.io.sockets[socketId]) {
      this.io.sockets[socketId].disconnect();
    }
  }
}

module.exports = {
  SocketIoMultiplayerNamespace
};