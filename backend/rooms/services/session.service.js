const DbService = require('moleculer-db/index');
const SqlAdapter = require('moleculer-db-adapter-sequelize');
const Sequelize = require('sequelize');
const { db, refreshJwt } = require('config');
const crypto = require('crypto');
const moment = require('moment');
const jwt = require('jsonwebtoken');
const uuid = require('uuid');
const { unauth } = require('helpers/errors');

module.exports = {
  name: 'session',
  mixins: [DbService],
  adapter: new SqlAdapter(db.connectionString),
  model: {
    name: 'session',
    define: {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
        unique: true
      },
      sessionId: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true
      },
      partecipantId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        unique: true
      }
    },
    options: {
      indexes: [{
        unique: true,
        fields: ['id']
      }, {
        unique: true,
        fields: ['sessionId']
      }]
    }
  },
  actions: {
    create: {
      visibility: 'public',
      params: {
        partecipantId: {
          type: 'number',
          positive: true,
          integer: true,
          convert: true
        }
      },
      async handler(ctx) {
        try {
          const { partecipantId } = ctx.params;
          // creo nuova sessione
          const sessionId = crypto.randomBytes(64).toString('hex');

          const session = await this._create(ctx, {
            sessionId,
            partecipantId
          });

          this.createRefreshCookie(ctx, session);
          return Promise.resolve(ctx.meta.$responseHeaders);
        } catch (e) {
          this.logger.error(e);
          return Promise.reject(e);
        }
      }
    },
    update: {
      async handler(ctx) {
        try {
          // verifico che la sessione sia valida
          const { session_auth } = ctx.meta.$cookies;

          if (!session_auth) {
            return Promise.reject(unauth('NO_SESSION'));
          }

          const {
            secret, issuer, audience
          } = refreshJwt;

          const decodedSession = jwt.verify(session_auth, secret, {
            audience,
            issuer
          });

          const { id, sessionId, partecipantId } = decodedSession;

          let partecipant = await this.broker.call('partecipant.get', {
            id: partecipantId
          });

          if (!partecipant) {
            return Promise.reject(unauth('PARTECIPANT_NOT_FOUND'));
          }

          let session = await this._find(ctx, {
            query: { sessionId, id, partecipantId }
          });

          if (!session || !session.length) {
            return Promise.reject(unauth('SESSION_NOT_FOUND'));
          }

          session = session[0];

          const renewedSessionId = crypto.randomBytes(64).toString('hex');

          const renewedSession = await this._update(ctx, {
            id,
            sessionId: renewedSessionId
          });

          this.createRefreshCookie(ctx, renewedSession);
          return Promise.resolve({
            responseHeaders: ctx.meta.$responseHeaders,
            partecipant
          });
        } catch (e) {
          this.logger.error(e);
          return Promise.reject(e);
        }
      }
    }
  },
  methods: {
    createRefreshCookie(ctx, session) {

      const {
        secret, notBefore, expiresInMinutes, issuer, audience, secure
      } = refreshJwt;

      const willExpireAt = moment().add(expiresInMinutes, 'minutes');

      const encoded = jwt.sign(session, secret, {
        algorithm: 'HS256',
        expiresIn: expiresInMinutes * 60,
        notBefore: notBefore,
        issuer: issuer,
        audience: audience,
        jwtid: uuid.v4()
      });
      const cookie =
        `session_auth=${encoded};Expires=${willExpireAt.toDate().toUTCString()};Max-Age:${expiresInMinutes * 60};Domain=localhost;Path=/;${secure ? 'Secure;' : ''}HttpOnly;`;
      ctx.meta.$responseHeaders = {
        'Set-Cookie': cookie
      };

    }
  }
};
