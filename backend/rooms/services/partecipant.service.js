const DbService = require("moleculer-db/index");
const { actions: DbActions } = DbService;
const SqlAdapter = require("moleculer-db-adapter-sequelize");
const Sequelize = require("sequelize");
const { db, jwt: jwtConfig } = require('config');
const uuid = require('uuid');
const jwt = require('jsonwebtoken');
const moment = require('moment');

module.exports = {
  name: "partecipant",
  mixins: [DbService],
  adapter: new SqlAdapter(db.connectionString),
  model: {
    name: "partecipant",
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
        const params = this.sanitizeParams(ctx, ctx.params);
        return this._create(ctx, params)
          .then((partecipant) => {
            this.createCookieHeader(ctx, partecipant);
            return partecipant;
          })
          .catch(e => {
            this.logger.error(e);
            return Promise.reject(e);
          });
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
