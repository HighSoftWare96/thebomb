const { socketIoManager } = require('socketio');
const { socketio } = require('config');

module.exports = {
  name: "socketio",
  mixins: [],
  settings: {
  },
  actions: {
    disconnectMultiplayerClient: {
      params: {
        socketId: {
          type: 'string'
        }
      }, handler(ctx) {
        const { socketId } = ctx.params;
        socketIoManager.disconnectClient(
          socketio.namespaces.multiplayer,
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