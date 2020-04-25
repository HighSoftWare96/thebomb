const DbService = require('moleculer-db/index');
const { actions: DbActions } = DbService;
const SqlAdapter = require('moleculer-db-adapter-sequelize');
const Sequelize = require('sequelize');
const { db, jwt: jwtConfig } = require('config');
const uuid = require('uuid');
const jwt = require('jsonwebtoken');
const moment = require('moment');
const { unauth } = require('helpers/errors');
const crypto = require('crypto');

module.exports = {
  name: 'partecipant',
  mixins: [DbService],
  adapter: new SqlAdapter(db.connectionString),
  model: {
    name: 'partecipant',
    define: {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
        unique: true
      },
      // alias nome del giocatore
      name: {
        type: Sequelize.STRING(30),
        allowNull: false
      },
      secret: {
        type: Sequelize.STRING(),
        allowNull: false
      },
      // seed per la generazione univoca dell'avatar
      // lato UI
      avatarSeed: {
        type: Sequelize.STRING(10),
        allowNull: false
      },
      // id della socket di socketio a cui il giocatore è collegato
      socketId: {
        // TODO: ? stringa o numero
        type: Sequelize.STRING,
        allowNull: true
      }
    },
    options: {
      indexes: [{
        unique: true,
        fields: ['id']
      }, {
        unique: true,
        fields: ['socketId']
      }]
    }
  },
  actions: {
    create: {
      params: {
        ...DbActions.create.params
      },
      handler(ctx) {
        const secret = crypto.randomBytes(30).toString('hex');
        const params = this.sanitizeParams(ctx, ctx.params);
        return this._create(ctx, {
          ...params,
          secret
        })
          .then((partecipant) => {
            this.createCookieHeader(ctx, partecipant);
            delete partecipant.secret;
            return partecipant;
          })
          .catch(e => {
            this.logger.error(e);
            return Promise.reject(e);
          });
      }
    },
    renew: {
      async handler(ctx) {
        try {
          const { partecipant_auth } = ctx.meta.$cookies;
          if (!partecipant_auth) {
            return Promise.reject(unauth('INVALID_SESSION'));
          }
          const {
            secret, issuer, audience
          } = jwtConfig;

          // verifico il JWT anche se scaduto
          const decodedUser = jwt.verify(partecipant_auth, secret, {
            ignoreExpiration: true,
            audience,
            issuer
          });

          const { id, secret: partecipantSecret } = decodedUser;

          let actualUser = await this._find(ctx, { id, secret: partecipantSecret });

          if (!actualUser || !actualUser[0]) {
            return Promise.reject(unauth('PARTECIPANT_NOT_FOUND'));
          }

          actualUser = actualUser[0];

          this.createCookieHeader(ctx, actualUser);
          delete actualUser.secret;
          return actualUser;
        } catch (e) {
          this.logger.error(e);
          return Promise.reject(e);
        }
      }
    }
  },
  methods: {
    createCookieHeader(ctx, partecipant) {

      const {
        secret, notBefore, expiresInMinutes, issuer, audience, secure
      } = jwtConfig;

      const willExpireAt = moment().add(expiresInMinutes, 'minutes');

      const encoded = jwt.sign(partecipant, secret, {
        algorithm: 'HS256',
        expiresIn: expiresInMinutes * 60,
        notBefore: notBefore,
        issuer: issuer,
        audience: audience,
        jwtid: uuid.v4()
      });
      const cookie =
        `partecipant_auth=${encoded};Expires=${willExpireAt.toDate().toUTCString()};Max-Age:${expiresInMinutes * 60};Domain=localhost;Path=/;${secure ? 'Secure;' : ''}HttpOnly;`;
      ctx.meta.$responseHeaders = {
        'Set-Cookie': cookie
      };

    }
  }
};
