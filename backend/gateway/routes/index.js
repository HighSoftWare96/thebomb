const cookieParser = require('cookie-parser');
const {cors} = require('../config');

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

  autoAliases: false,

  aliases: {
    'POST /rooms': 'room.create',
    'GET /rooms/:inviteId': 'room.getByInviteId',
    'POST /rooms/join/:inviteId': 'room.join',
    'POST /partecipants': 'partecipant.create',
    'PATCH /partecipants/:id': 'partecipant.update',
    'POST /partecipants/renew': 'partecipant.renew',
    'GET /partecipants/:id': 'partecipant.get',
    'POST /game/start': 'game.start',
    'GET /syllable/random': 'itSyllables.getRandom'
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

  logging: true,
  cors: {
    // Configures the Access-Control-Allow-Origin CORS header.
    origin: cors.origin,
    // Configures the Access-Control-Allow-Methods CORS header. 
    methods: ['GET', 'OPTIONS', 'POST', 'PUT', 'DELETE', 'PATCH'],
    credentials: true,
  },
}];