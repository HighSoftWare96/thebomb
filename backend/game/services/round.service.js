const DbService = require("moleculer-db");
const { actions: DbActions } = DbService;
const SqlAdapter = require("moleculer-db-adapter-sequelize");
const Sequelize = require("sequelize");
const { db } = require('config');

module.exports = {
  name: "round",
  mixins: [DbService],
  adapter: new SqlAdapter(db.connectionString),
  model: {
    name: "round",
    define: {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
        unique: true
      },
      syllable: {
        type: Sequelize.STRING(15),
        allowNull: false
      },
      dice: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 0,
        validate: {
          // 0 = non all'inizio
          // 1 = non alla fine
          // 2 = dappertutto
          min: 0,
          max: 2
        }
      },
      gameId: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      // round finito o in gioco
      ended: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false
      },
      // STATO del RUOND
      currentPartecipantId: {
        type: Sequelize.INTEGER,
        allowNull: true
      }
    },
    options: {
      indexes: [{
        unique: true,
        fields: ['id']
      }, {
        unique: false,
        fields: ['gameId']
      }]
    }
  },
  actions: {
    turnCheck: {
      params: {
        partecipantId: {
          type: 'number',
          convert: true,
          integer: true,
          positive: true
        },
        roundId: {
          type: 'number',
          convert: true,
          integer: true,
          positive: true
        },
        response: 'string'
      },
      async handler(ctx) {
        try {
          const { partecipantId, roundId, response } = ctx.params;

          let round = await this._find(ctx, {
            id: roundId,
            currentPartecipantId: partecipantId,
            ended: false
          });

          if (!round || !round.length) {
            return Promise.reject('ROUND_NOT_FOUND');
          }

          round = round[0];

          let game = await this.broker.call('game.find', {
            id: round.gameId,
            ended: false
          });

          if (!game || !game.length) {
            return Promise.reject('GAME_NOT_FOUND');
          }

          game = game[0];

          const room = await this.broker.call('room.get', {
            id: game.roomId
          });

          if (!room) {
            return Promise.reject('ROOM_NOT_FOUND');
          } else if (!room.partecipantIds.includes(partecipantId)) {
            return Promise.reject('PARTECIPANT_NOT_FOUND');
          }

          // se la risposta è giusta
          if (this.isResponseRight(round, response)) {
            const currentPartecipantIdx = room.partecipantIds.indexOf(
              partecipantId
            );
            const nextPartecipantIdx = (currentPartecipantIdx + 1) % room.partecipantIds.length;

            // aggiorno il round
            const updatedRound = await this._update(ctx, {
              ...round,
              currentPartecipantId: room.partecipantIds[nextPartecipantIdx]
            });

            // passo al prossimo giocatore
            return this.broker.call('socketio.turnChecked', {
              round: updatedRound,
              socketioRoom: room.socketioRoom
            });
          }
          return Promise.reject('WRONG_RESPONSE');
        } catch (e) {
          this.logger.error(e);
          return Promise.reject(e);
        }
      }
    },
    removeByGameId: {
      visibility: 'public',
      params: {
        gameId: {
          type: 'number',
          convert: true,
          integer: true,
          positive: true
        }
      },
      async handler(ctx) {
        try {
          const { gameId } = ctx.params;
          const rounds = await this._find(ctx, {
            query: { gameId }
          });
          for (const round of rounds) {
            await this._remove(ctx, {
              id: round.id
            });
          }
          return Promise.resolve(rounds.length);
        } catch (e) {
          this.logger.error(e);
          return Promise.reject(e);
        }
      }
    }
  },
  methods: {
    isResponseRight(round, response) {
      const responseLowerCase =
        response.toLowerCase();
      const syllableLowerCase =
        round.syllable.toLowerCase();
      let responseIsRight = false;

      switch (round.dice) {
        case 0:
          // non all'inizio
          responseIsRight = responseLowerCase.endsWith(syllableLowerCase) ||
            (responseLowerCase.includes(syllableLowerCase) && !responseLowerCase.startsWith(syllableLowerCase));
          break;
        case 1:
          // non alla fine
          responseIsRight = responseLowerCase.startsWith(syllableLowerCase) ||
            (responseLowerCase.includes(syllableLowerCase) || !responseLowerCase.endsWith(syllableLowerCase));
          break;
        default:
          responseIsRight = responseLowerCase.includes(syllableLowerCase);
          break;
      }
      return responseIsRight;
    }
  }
};
