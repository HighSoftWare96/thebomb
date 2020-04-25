const cookieParser = require('cookie-parser');

module.exports = [{
  path: '/api',
  whitelist: [
    '**'
  ],
  use: [
    cookieParser()
  ],
  mergeParams: true,
  authentication: true,
  authorization: true,

  autoAliases: true,

  aliases: {
    'POST /rooms': 'room.create',
    'POST /rooms/join/:id': 'room.join',
    // TODO: remove
    'POST /rooms/leave/:id': 'room.leave',
    'GET /rooms/:id': 'room.get',
    'POST /partecipants': 'partecipant.create',
    'POST /partecipants/renew': 'partecipant.renew',
    'GET /partecipants/:id': 'partecipant.get',
    'POST /game/start': 'game.start'
  },

  callingOptions: {},

  bodyParsers: {
    json: {
      strict: false,
      limit: '1MB'
    },
    urlencoded: {
      extended: true,
      limit: '1MB'
    }
  },

  onBeforeCall(ctx, route, req) {
    ctx.meta.$requestHeaders = req.headers;
    ctx.meta.$cookies = req.cookies;
  },

  mappingPolicy: 'all', // Available values: 'all', 'restrict'

  logging: true
}];