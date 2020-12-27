const { socketIoManager } = require('socketio');
const { socketio: socketioConfig } = require('config');
const events = require('socketio/events');

module.exports = {
  name: 'socketio',
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
    },
    endGame: {
      params: {
        socketioRoom: {
          type: 'string'
        },
        game: 'object',
        statistics: 'array'
      },
      handler(ctx) {
        const {
          game,
          statistics,
          socketioRoom
        } = ctx.params;

        socketIoManager.emit(
          socketioConfig.namespaces.multiplayer,
          socketioRoom,
          events.fromServer.gameEnded,
          { game, statistics }
        );
        return Promise.resolve();
      }
    },
    turnChecked: {
      params: {
        socketioRoom: {
          type: 'string'
        },
        round: 'object'
      },
      handler(ctx) {
        const {
          round,
          socketioRoom
        } = ctx.params;

        socketIoManager.emit(
          socketioConfig.namespaces.multiplayer,
          socketioRoom,
          events.fromServer.turnChecked,
          { round }
        );

        return Promise.resolve();
      }
    },
    turnWrong: {
      params: {
        socketioRoom: {
          type: 'string'
        },
        round: 'object',
        reason: {
          type: 'enum',
          optional: true,
          values: ['ALREADY_USED', 'SYLLABLE_NOT_FOUND', 'MUST_NOT_BEGIN_WITH', 'MUST_NOT_END_WITH', 'INVALID_WORD']
        }
      },
      handler(ctx) {
        const {
          round,
          socketioRoom,
          reason = ''
        } = ctx.params;

        socketIoManager.emit(
          socketioConfig.namespaces.multiplayer,
          socketioRoom,
          events.fromServer.turnWrong,
          { round, reason }
        );

        return Promise.resolve();
      }
    },
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
};