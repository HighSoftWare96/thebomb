const { socketIoManager } = require('socketio');
const { socketio: socketioConfig } = require('config');
const events = require('socketio/events');

module.exports = {
  name: "socketio",
  mixins: [],
  settings: {
  },
  actions: {
    startGame: {
      params: {
        socketioRoom: {
          type: 'string'
        },
        game: 'object'
      },
      handler(ctx) {
        const { game, socketioRoom } = ctx.params;
        socketIoManager.emit(
          socketioConfig.namespaces.multiplayer,
          socketioRoom,
          events.fromServer.gameStarted,
          { game }
        );
        return Promise.resolve();
      }
    },
    startRound: {
      params: {
        socketioRoom: {
          type: 'string'
        },
        round: 'object'
      },
      handler(ctx) {
        const { round, socketioRoom } = ctx.params;
        socketIoManager.emit(
          socketioConfig.namespaces.multiplayer,
          socketioRoom,
          events.fromServer.roundStarted,
          { round }
        );
        return Promise.resolve();
      }
    },
    endRound: {
      params: {
        socketioRoom: {
          type: 'string'
        },
        round: 'object'
      },
      handler(ctx) {
        const { round, socketioRoom } = ctx.params;
        socketIoManager.emit(
          socketioConfig.namespaces.multiplayer,
          socketioRoom,
          events.fromServer.roundEnded,
          { round }
        );
        return Promise.resolve();
      }
    }
    disconnectClient: {
      params: {
        socketId: {
          type: 'string'
        }
      }, handler(ctx) {
        const { socketId } = ctx.params;
        socketIoManager.disconnectClient(
          socketioConfig.namespaces.multiplayer,
          socketId
        );
        return Promise.resolve();
      }
    }
  },
  events: {
  },
  created() {
    socketIoManager.initialize(this);
  }
}