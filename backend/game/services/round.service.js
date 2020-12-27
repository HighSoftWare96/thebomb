const DbService = require('moleculer-db');
const SqlAdapter = require('moleculer-db-adapter-sequelize');
const Sequelize = require('sequelize');
const { db } = require('config');

module.exports = {
  name: 'round',
  mixins: [DbService],
  adapter: new SqlAdapter(db.connectionString),
  model: {
    name: 'round',
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
      },
      usedWords: {
        type: Sequelize.ARRAY(Sequelize.STRING),
        allowNull: false,
        defaultValue: []
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
    create: {
      params: {
        gameId: {
          type: 'number',
          integer: true,
          positive: true,
          convert: true
        },
        language: {
          type: 'string'
        },
        difficulty: {
          type: 'number',
          integer: true,
          convert: true,
          positive: true,
          min: 0,
          max: 5
        },
        currentPartecipantId: {
          type: 'number',
          integer: true,
          positive: true,
          convert: true
        }
      },
      async handler(ctx) {
        try {
          const {
            language,
            gameId,
            currentPartecipantId,
            difficulty
          } = ctx.params;

          const syllableService = `${language}Syllables`;
          const randSyllable = await this.broker.call(`${syllableService}.getRandom`, {
            difficulty
          });

          const round = {
            dice: this.throwDice(),
            gameId,
            currentPartecipantId,
            ended: false,
            syllable: randSyllable.syllable
          };

          return this._create(ctx, round);
        } catch (e) {
          this.logger.error(e);
          return Promise.reject(e);
        }
      }
    },
    turnCheck: {
      params: {
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
          const { roundId, response } = ctx.params;
          const { id: partecipantId } = ctx.meta.user;

          let round = await this._find(ctx, 
            {
              query: {
                id: roundId,
                currentPartecipantId: partecipantId,
                ended: false
              }
            }
          );

          if (!round || !round.length || !round[0]) {
            return Promise.reject('ROUND_NOT_FOUND');
          }

          round = round[0];

          let game = await this.broker.call('game.find', {
            query: {
              id: round.gameId
            }
          });

          if (!game || !game.length || !game[0]) {
            return Promise.reject('GAME_NOT_FOUND');
          }

          game = game[0];

          let room = await this.broker.call('room.find', {
            query: {
              id: game.roomId,
              locked: true
            }
          });

          if (!room || !room.length || !room[0]) {
            return Promise.reject('ROOM_NOT_FOUND');
          }

          room = room[0];

          if (!room.partecipantIds.includes(partecipantId)) {
            return Promise.reject('PARTECIPANT_NOT_FOUND');
          }

          const result = await this.isResponseRight(round, game, response);

          // se la risposta è giusta
          if (result.valid) {
            const currentPartecipantIdx = room.partecipantIds.indexOf(
              partecipantId
            );
            const nextPartecipantIdx = (currentPartecipantIdx + 1) % room.partecipantIds.length;

            // aggiorno il round
            const updatedRound = await this._update(ctx, {
              id: round.id,
              currentPartecipantId: room.partecipantIds[nextPartecipantIdx],
              // adding used words to round
              usedWords: [...round.usedWords, response.toLowerCase()]
            });

            // passo al prossimo giocatore
            return this.broker.call('socketio.turnChecked', {
              round: updatedRound,
              socketioRoom: room.socketioRoom,
              response,
              previousRound: round
            });
          }
          // wrong turn.. signal to socketio
          return this.broker.call('socketio.turnWrong', {
            round,
            socketioRoom: room.socketioRoom,
            response,
            reason: result.reason
          });
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
    throwDice() {
      return Math.floor(Math.random() * 3);
    },
    async isResponseRight(round, game, response) {
      let reason = '';
      const { usedWords } = round;
      const { language } = game;

      const wordService = `${language}Words`;

      const responseLowerCase =
        response.toLowerCase();
      const syllableLowerCase =
        round.syllable.toLowerCase();

      // already used word!
      if (usedWords.includes(responseLowerCase)) {
        reason = 'ALREADY_USED';
        return {valid: false, reason};
      }

      // syllable not present
      if(!responseLowerCase.includes(syllableLowerCase)) {
        reason = 'SYLLABLE_NOT_FOUND';
        return {valid: false, reason};
      }

      let responseIsRight = false;

      if (round.dice === 0) {
        // non all'inizio
        responseIsRight = responseLowerCase.endsWith(syllableLowerCase) ||
          (responseLowerCase.includes(syllableLowerCase) && !responseLowerCase.startsWith(syllableLowerCase));
        reason = responseIsRight ? '' : 'MUST_NOT_BEGIN_WITH';
      } else if (round.dice === 1) {
        // non alla fine
        responseIsRight = responseLowerCase.startsWith(syllableLowerCase) ||
          (responseLowerCase.includes(syllableLowerCase) || !responseLowerCase.endsWith(syllableLowerCase));
        reason = responseIsRight ? '' : 'MUST_NOT_END_WITH';
      } else {
        // syllable already present
        responseIsRight = true;
      }

      if (!responseIsRight) {
        return {valid: false, reason};
      } else {
        const fromdb = await this.broker.call(`${wordService}.find`, {
          limit: 1,
          query: { word: response }
        });
        const {length = 0} = fromdb;
        // verifico che la parola esista
        return {
          valid: length > 0, 
          reason: length > 0 ? '' : 'INVALID_WORD'
        };
      }
    }
  }
};
