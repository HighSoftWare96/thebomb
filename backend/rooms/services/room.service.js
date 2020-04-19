const DbService = require('moleculer-db');
const { actions: DbActions } = DbService;
const SqlAdapter = require('moleculer-db-adapter-sequelize');
const Sequelize = require('sequelize');
const { Op } = Sequelize;
const { db } = require('config');
const { notFound, roomFull } = require('helpers/errors');
const uuid = require('uuid');

module.exports = {
  name: 'room',
  mixins: [DbService],
  adapter: new SqlAdapter(db.connectionString),
  model: {
    name: 'room',
    define: {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
        unique: true
      },
      // id del partecipante admin
      adminPartecipantId: Sequelize.INTEGER,
      // ids dei partecipanti
      partecipantIds: {
        type: Sequelize.ARRAY(Sequelize.INTEGER),
        defaultValue: []
      },
      // id room socketio associata
      socketioRoom: Sequelize.STRING,
      // id della partita corrente
      currentGameId: {
        type: Sequelize.INTEGER,
        allowNull: true,
        unique: true
      },
      // id delle partite precedenti
      playedGameIds: Sequelize.ARRAY(Sequelize.INTEGER),
      // stanza bloccata in gioco
      locked: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false
      },
      // OPZIONI PER LA STANZA
      // numero massimo di partecipanti
      maxPartecipants: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 5
      }
    },
    options: {
      indexes: [
        {
          unique: true,
          fields: ['id']
        },
        {
          unique: true,
          fields: ['socketioRoom']
        },
        {
          unique: true,
          fields: ['currentGameId']
        }
      ]
    }
  },
  actions: {
    create: {
      params: {
        adminPartecipantId: {
          type: 'number',
          integer: true,
          positive: true,
          convert: true
        },
        maxPartecipants: {
          type: 'number',
          integer: true,
          positive: true,
          convert: true,
          optional: true
        }
      },
      async handler(ctx) {
        try {
          let { params } = ctx;
          const { adminPartecipantId } = params;

          // verifico il partecipante che non sia connesso ad altro
          const foundPartecipants = await this.broker.call('partecipant.find', {
            query: {
              id: adminPartecipantId,
              socketId: null
            }
          });

          if (!foundPartecipants || !foundPartecipants.length || !foundPartecipants[0]) {
            return Promise.reject(
              notFound('partecipant', adminPartecipantId)
            );
          }

          params = this.sanitizeParams(ctx, params);
          return this._create(ctx, params);
        } catch (e) {
          this.logger.error(e);
          return Promise.reject(e);
        }
      }
    },
    join: {
      params: {
        id: {
          type: 'number',
          integer: true,
          positive: true,
          convert: true
        },
        partecipantId: {
          type: 'number',
          integer: true,
          positive: true,
          convert: true
        }
      },
      async handler(ctx) {
        try {
          const { id, partecipantId } = ctx.params;

          // recupero la stanza
          let room = this._find(ctx, {
            id,
            locked: false
          });

          if (!room || !room.length) {
            return Promise.reject(
              notFound('room', id)
            );
          }

          room = room[0];

          // cerco il partecipante e verifico sia libero
          const foundPartecipants = await this.broker.call('partecipant.find', {
            query: {
              id: partecipantId,
              socketId: null
            }
          });

          if (!foundPartecipants || !foundPartecipants.length || !foundPartecipants[0]) {
            return Promise.reject(
              notFound('partecipant', partecipantId)
            );
          }

          // controllo il numero massimo di partecipanti
          if (
            room.partecipantIds &&
            room.partecipantIds.length >= room.maxPartecipants
          ) {
            return Promise.reject(
              roomFull(id)
            );
          }

          if (!room.socketioRoom) {
            // creo la socketio room
            room.socketioRoom = uuid.v4();
          }

          // aggiungo il partecipante alla stanza su db
          return this._update(ctx, {
            id,
            ...room,
            partecipantIds: [
              ...(room.partecipantIds || []),
              partecipantId
            ]
          });
        } catch (e) {
          this.logger.error(e);
          return Promise.reject(e);
        }
      }
    },
    // chiamata da socketio quando un client
    // si disconnette
    leave: {
      params: {
        id: {
          type: 'number',
          integer: true,
          positive: true,
          convert: true
        },
        partecipantId: {
          type: 'number',
          integer: true,
          positive: true,
          convert: true
        }
      },
      async handler(ctx) {
        try {
          const { id, partecipantId } = ctx.params;

          // cerco la stanza con quel partecipante
          const foundRooms = await this._find(ctx, {
            query: {
              id,
              partecipantIds: {
                [Op.contains]: [partecipantId]
              }
            }
          });

          if (!foundRooms || !foundRooms.length || !foundRooms[0]) {
            return Promise.reject(
              notFound('room', id)
            );
          }
          const room = foundRooms[0];

          // recupero il partecipante
          const foundPartecipants = await this.broker.call('partecipant.find', {
            query: {
              id: partecipantId
            }
          });


          if (!foundPartecipants || !foundPartecipants[0]) {
            return Promise.reject(
              notFound('partecipant', partecipantId)
            );
          }

          const partecipant = foundPartecipants[0];

          // disconnetto il client dal socket
          await this.broker.call('socketio.disconnectClient', {
            socketId: partecipant.socketId
          });

          // rimuovo il socketid dal partecipant
          await this.broker.call('partecipant.update', {
            id: partecipant.id,
            socketId: null
          });

          const foundIndex =
            room.partecipantIds.findIndex(i => i.id === partecipantId);

          // rimuovo il giocatore dalla stanza
          room.partecipantIds.splice(foundIndex, 1);

          // non ci sono più partecipanti: elimino la stanza
          if (room.partecipantIds.length === 0) {
            return this._remove(ctx, {
              id: room.id
            });
          } else if (room.adminPartecipantId === partecipant.id) {
            // la stanza è stata lasciata dall'admin
            // promuovo il prossimo partecipante a admin
            room.adminPartecipantId = room.partecipantIds[0];
          }

          // in caso normale aggiorno la stanza
          return this._update(ctx, {
            ...room
          });

        } catch (e) {
          this.logger.error(e);
          return Promise.reject(e);
        }
      }
    },
  }
};
