const DbService = require('moleculer-db/index');
const { actions: DbActions } = DbService;
const SqlAdapter = require('moleculer-db-adapter-sequelize');
const Sequelize = require('sequelize');
const { db, jwt: jwtConfig } = require('config');
const uuid = require('uuid');
const jwt = require('jsonwebtoken');

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
      // seed per la generazione univoca dell'avatar
      // lato UI
      avatarSeed: {
        type: Sequelize.STRING(10),
        allowNull: false
      },
      // id della socket di socketio a cui il giocatore è collegato
      socketId: {
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
      async handler(ctx) {
        try {
          const params = this.sanitizeParams(ctx, ctx.params);
          const partecipant = await this._create(ctx, params);
          const jwt = this.createJWT(partecipant);

          ctx.meta.$responseHeaders =
            await this.broker.call('session.create', {
              partecipantId: partecipant.id
            });

          return {
            partecipant,
            jwt
          };
        } catch (e) {
          this.logger.error(e);
          return Promise.reject(e);
        }
      }
    },
    renew: {
      handler(ctx) {
        return this.broker.call(
          'session.update',
          {},
          { meta: ctx.meta }
        ).then(({ responseHeaders, partecipant }) => {
          const jwt = this.createJWT(partecipant);
          ctx.meta.$responseHeaders = responseHeaders;

          return Promise.resolve({
            partecipant,
            jwt
          });
        });
      }
    }
  },
  methods: {
    createJWT(partecipant) {

      const {
        secret, notBefore, expiresInMinutes, issuer, audience
      } = jwtConfig;

      const encoded = jwt.sign(partecipant, secret, {
        algorithm: 'HS256',
        expiresIn: expiresInMinutes * 60,
        notBefore: notBefore,
        issuer: issuer,
        audience: audience,
        jwtid: uuid.v4()
      });

      return encoded;

    }
  }
};
