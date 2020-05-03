const { socketio: socketioConfig } = require('config');
const events = require('./events');
const { jwt: jwtConfig } = require('config');
const jwt = require('jsonwebtoken');
const { Op } = require('sequelize');

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


  async _handleClientHandshake(client, next) {
    const {
      socketioRoom,
      accessToken
    } = client.handshake.query;

    // controllo paramtri connessione
    if (!socketioRoom || !accessToken) {
      return next(new Error('MISSING_PARAMS'));
    }

    // disconnessione automatica entro 10 minuti
    const disconnectUser = setTimeout(() => {
      client.disconnect();
    }, 10000);

    try {
      const {
        secret, issuer, audience
      } = jwtConfig;

      const decoded = jwt.verify(accessToken, secret, {
        issuer: issuer,
        audience: audience
      });

      // cerco un partecipante con quell'ID e che sia libero
      const foundPartecipants = await this.service.broker.call('partecipant.find', {
        query: {
          id: decoded.id,
          socketId: null
        }
      });

      if (!foundPartecipants || !foundPartecipants.length) {
        return next(new Error('PARTECIPANT_NOT_FOUND'));
      }

      // cerco una stanza corrispondente, non bloccata, contenente quel partecipante
      const foundRoom = await this.service.broker.call('room.count', {
        query: {
          socketioRoom,
          locked: false,
          [Op.contains]: {
            partecipantIds: [decoded.id]
          }
        }
      });

      if (!foundRoom) {
        return next(new Error('ROOM_NOT_FOUND'));
      }

      // evito la disconnessione automatica
      clearTimeout(disconnectUser);

      // dati aggiuntivi alla socket
      client.partecipant = foundPartecipants[0];

      // ok tutto a posto
      next();

    } catch (e) {
      this.service.logger.error(e);
      return next(new Error('JOINING_ERROR'));
    }
  }

  async _handleClientConnection(client) {
    try {
      const {
        id: socketId,
        partecipant
      } = client;
      const {
        socketioRoom
      } = client.handshake.query;

      // mi salvo il client id di socketio per questo partecipante
      const updatedPartecipant = await this.service.broker.call('partecipant.update', {
        id: partecipant.id,
        socketId
      });

      // cerco una stanza corrispondente
      const foundRoom = await this.service.broker.call('room.find', {
        query: { socketioRoom, locked: false }
      });


      // alla disconnessione mi assicuro che il partecipante lasci la stanza
      client.on('disconnect', async () => {
        try {
          const updatedPartecipant = await this.service.broker.call('partecipant.get', {
            id: partecipant.id
          });

          const updatedRoom = await this.service.broker.call('room.leave',
            { id: foundRoom[0].id },
            { meta: { user: updatedPartecipant } }
          );

          const partecipants = [];

          for (const id of updatedRoom.partecipantIds) {
            const currentP = await this.service.broker.call('partecipant.get', {
              id
            });
            partecipants.push(currentP);
          }

          this.io.to(socketioRoom).emit(
            events.fromServer.roomateLeft,
            {
              room: updatedRoom,
              partecipants
            });
        } catch (e) {
          this.service.logger.error('Client disconnection: unable to leave room.', e);
        }
      });

      // join  socketio room
      client.join(socketioRoom);

      this.service.logger.info(
        'New client connected @'
        + ' PARTECIPANT_ID: ' + partecipant.id
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

      const partecipants = [];

      for (const id of foundRoom[0].partecipantIds) {
        const currentP = await this.service.broker.call('partecipant.get', {
          id
        });
        partecipants.push(currentP);
      }

      // comunico a tutti l'arrivo del nuovo utente
      this.io.to(socketioRoom).emit(
        events.fromServer.newRoomate,
        {
          room: foundRoom[0],
          partecipants
        });

      // mi registro per eventuali eventi dal client
      client.on(events.fromClient.turnCheck, async (payload) => {
        try {
          await this.service.broker.call('round.turnCheck', payload, {
            meta: { user: partecipant }
          });
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